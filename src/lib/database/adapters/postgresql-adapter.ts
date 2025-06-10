// PostgreSQL Database Adapter
import { Pool, PoolClient, QueryResult as PgQueryResult } from 'pg';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { 
  BaseDatabaseAdapter, 
  DatabaseConfig, 
  QueryResult, 
  TransactionContext,
  DatabaseError,
  ValidationError 
} from './base-adapter';

export class PostgreSQLAdapter extends BaseDatabaseAdapter {
  private pool: Pool | null = null;
  private activeTransactions: Map<string, PoolClient> = new Map();

  async connect(): Promise<void> {
    try {
      this.pool = new Pool({
        connectionString: this.config.connectionString,
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.username,
        password: this.config.password,
        ssl: this.config.ssl ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        ...this.config.options,
      });

      // Test connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      this.isConnected = true;
      console.log('PostgreSQL connected successfully');
    } catch (error) {
      this.logError(error as Error, { config: this.config });
      throw new DatabaseError(`Failed to connect to PostgreSQL: ${(error as Error).message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.isConnected = false;
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      if (!this.pool) return false;
      const client = await this.pool.connect();
      await client.query('SELECT 1');
      client.release();
      return true;
    } catch {
      return false;
    }
  }

  async create<T>(table: string, data: Partial<T>): Promise<QueryResult<T>> {
    try {
      const sanitizedData = this.sanitizeInput(data);
      const columns = Object.keys(sanitizedData);
      const values = Object.values(sanitizedData);
      const placeholders = values.map((_, index) => `$${index + 1}`);

      const query = `
        INSERT INTO ${table} (${columns.join(', ')})
        VALUES (${placeholders.join(', ')})
        RETURNING *
      `;

      const result = await this.executeQuery(query, values);
      
      return {
        data: result.rows[0] as T,
        metadata: { insertedId: result.rows[0]?.id }
      };
    } catch (error) {
      this.logError(error as Error, { table, data });
      return { data: null, error: (error as Error).message };
    }
  }

  async findOne<T>(table: string, conditions: any): Promise<QueryResult<T>> {
    try {
      const { whereClause, values } = this.buildWhereClause(conditions);
      const query = `SELECT * FROM ${table} ${whereClause} LIMIT 1`;
      
      const result = await this.executeQuery(query, values);
      
      return {
        data: result.rows[0] as T || null
      };
    } catch (error) {
      this.logError(error as Error, { table, conditions });
      return { data: null, error: (error as Error).message };
    }
  }

  async findMany<T>(table: string, conditions?: any, options?: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    select?: string[];
  }): Promise<QueryResult<T[]>> {
    try {
      const selectClause = options?.select ? options.select.join(', ') : '*';
      let query = `SELECT ${selectClause} FROM ${table}`;
      let values: any[] = [];

      if (conditions) {
        const { whereClause, values: whereValues } = this.buildWhereClause(conditions);
        query += ` ${whereClause}`;
        values = whereValues;
      }

      if (options?.orderBy) {
        query += ` ORDER BY ${options.orderBy} ${options.orderDirection || 'ASC'}`;
      }

      if (options?.limit) {
        query += ` LIMIT $${values.length + 1}`;
        values.push(options.limit);
      }

      if (options?.offset) {
        query += ` OFFSET $${values.length + 1}`;
        values.push(options.offset);
      }

      const result = await this.executeQuery(query, values);
      
      return {
        data: result.rows as T[],
        count: result.rowCount || 0
      };
    } catch (error) {
      this.logError(error as Error, { table, conditions, options });
      return { data: [], error: (error as Error).message };
    }
  }

  async update<T>(table: string, conditions: any, data: Partial<T>): Promise<QueryResult<T>> {
    try {
      const sanitizedData = this.sanitizeInput(data);
      const { whereClause, values: whereValues } = this.buildWhereClause(conditions);
      
      const setClause = Object.keys(sanitizedData)
        .map((key, index) => `${key} = $${whereValues.length + index + 1}`)
        .join(', ');
      
      const values = [...whereValues, ...Object.values(sanitizedData)];
      
      const query = `
        UPDATE ${table} 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        ${whereClause}
        RETURNING *
      `;

      const result = await this.executeQuery(query, values);
      
      return {
        data: result.rows[0] as T,
        count: result.rowCount || 0
      };
    } catch (error) {
      this.logError(error as Error, { table, conditions, data });
      return { data: null, error: (error as Error).message };
    }
  }

  async delete(table: string, conditions: any): Promise<QueryResult<boolean>> {
    try {
      const { whereClause, values } = this.buildWhereClause(conditions);
      const query = `DELETE FROM ${table} ${whereClause}`;
      
      const result = await this.executeQuery(query, values);
      
      return {
        data: (result.rowCount || 0) > 0,
        count: result.rowCount || 0
      };
    } catch (error) {
      this.logError(error as Error, { table, conditions });
      return { data: false, error: (error as Error).message };
    }
  }

  async count(table: string, conditions?: any): Promise<number> {
    try {
      let query = `SELECT COUNT(*) as count FROM ${table}`;
      let values: any[] = [];

      if (conditions) {
        const { whereClause, values: whereValues } = this.buildWhereClause(conditions);
        query += ` ${whereClause}`;
        values = whereValues;
      }

      const result = await this.executeQuery(query, values);
      return parseInt(result.rows[0].count);
    } catch (error) {
      this.logError(error as Error, { table, conditions });
      return 0;
    }
  }

  async exists(table: string, conditions: any): Promise<boolean> {
    const count = await this.count(table, conditions);
    return count > 0;
  }

  async search<T>(table: string, searchTerm: string, fields: string[], options?: {
    limit?: number;
    offset?: number;
  }): Promise<QueryResult<T[]>> {
    try {
      const searchConditions = fields.map((field, index) => 
        `${field} ILIKE $${index + 1}`
      ).join(' OR ');
      
      const values = fields.map(() => `%${searchTerm}%`);
      
      let query = `SELECT * FROM ${table} WHERE ${searchConditions}`;
      
      if (options?.limit) {
        query += ` LIMIT $${values.length + 1}`;
        values.push(options.limit);
      }

      if (options?.offset) {
        query += ` OFFSET $${values.length + 1}`;
        values.push(options.offset);
      }

      const result = await this.executeQuery(query, values);
      
      return {
        data: result.rows as T[],
        count: result.rowCount || 0
      };
    } catch (error) {
      this.logError(error as Error, { table, searchTerm, fields });
      return { data: [], error: (error as Error).message };
    }
  }

  async beginTransaction(): Promise<TransactionContext> {
    try {
      if (!this.pool) throw new Error('Database not connected');
      
      const client = await this.pool.connect();
      await client.query('BEGIN');
      
      const transactionId = this.generateId();
      this.activeTransactions.set(transactionId, client);
      
      return {
        id: transactionId,
        isActive: true,
        operations: []
      };
    } catch (error) {
      throw new DatabaseError(`Failed to begin transaction: ${(error as Error).message}`);
    }
  }

  async commitTransaction(context: TransactionContext): Promise<void> {
    try {
      const client = this.activeTransactions.get(context.id);
      if (!client) throw new Error('Transaction not found');
      
      await client.query('COMMIT');
      client.release();
      this.activeTransactions.delete(context.id);
    } catch (error) {
      throw new DatabaseError(`Failed to commit transaction: ${(error as Error).message}`);
    }
  }

  async rollbackTransaction(context: TransactionContext): Promise<void> {
    try {
      const client = this.activeTransactions.get(context.id);
      if (!client) throw new Error('Transaction not found');
      
      await client.query('ROLLBACK');
      client.release();
      this.activeTransactions.delete(context.id);
    } catch (error) {
      throw new DatabaseError(`Failed to rollback transaction: ${(error as Error).message}`);
    }
  }

  async createTable(tableName: string, schema: any): Promise<void> {
    // Implementation for creating tables dynamically
    throw new Error('Dynamic table creation not implemented for PostgreSQL');
  }

  async dropTable(tableName: string): Promise<void> {
    await this.executeQuery(`DROP TABLE IF EXISTS ${tableName}`);
  }

  async addColumn(tableName: string, columnName: string, columnType: any): Promise<void> {
    await this.executeQuery(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`);
  }

  async removeColumn(tableName: string, columnName: string): Promise<void> {
    await this.executeQuery(`ALTER TABLE ${tableName} DROP COLUMN ${columnName}`);
  }

  async createIndex(tableName: string, columns: string[], options?: {
    unique?: boolean;
    name?: string;
  }): Promise<void> {
    const indexName = options?.name || `idx_${tableName}_${columns.join('_')}`;
    const uniqueClause = options?.unique ? 'UNIQUE' : '';
    const query = `CREATE ${uniqueClause} INDEX ${indexName} ON ${tableName} (${columns.join(', ')})`;
    
    await this.executeQuery(query);
  }

  async dropIndex(tableName: string, indexName: string): Promise<void> {
    await this.executeQuery(`DROP INDEX IF EXISTS ${indexName}`);
  }

  async aggregate(table: string, pipeline: any[]): Promise<QueryResult<any>> {
    // PostgreSQL doesn't have MongoDB-style aggregation, implement custom logic
    throw new Error('Aggregation pipeline not implemented for PostgreSQL');
  }

  async backup(options?: { tables?: string[]; format?: string }): Promise<string> {
    // Implementation would use pg_dump
    throw new Error('Backup not implemented for PostgreSQL adapter');
  }

  async restore(backupData: string, options?: { overwrite?: boolean }): Promise<void> {
    // Implementation would use pg_restore
    throw new Error('Restore not implemented for PostgreSQL adapter');
  }

  async encryptField(value: string, field: string): Promise<string> {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return `${iv.toString('hex')}:${encrypted}`;
  }

  async decryptField(encryptedValue: string, field: string): Promise<string> {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32);
    
    const [ivHex, encrypted] = encryptedValue.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    
    const decipher = crypto.createDecipher(algorithm, key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async logOperation(operation: {
    type: string;
    table: string;
    userId?: string;
    data?: any;
    timestamp: Date;
    ipAddress?: string;
  }): Promise<void> {
    try {
      await this.create('audit_logs', {
        operation_type: operation.type,
        table_name: operation.table,
        user_id: operation.userId,
        operation_data: JSON.stringify(operation.data),
        ip_address: operation.ipAddress,
        created_at: operation.timestamp
      });
    } catch (error) {
      console.error('Failed to log operation:', error);
    }
  }

  async getPerformanceMetrics(): Promise<{
    connectionCount: number;
    queryCount: number;
    averageQueryTime: number;
    slowQueries: Array<{
      query: string;
      duration: number;
      timestamp: Date;
    }>;
  }> {
    // Implementation would query PostgreSQL system tables
    return {
      connectionCount: this.pool?.totalCount || 0,
      queryCount: 0,
      averageQueryTime: 0,
      slowQueries: []
    };
  }

  // Helper Methods
  private async executeQuery(query: string, values?: any[]): Promise<PgQueryResult> {
    if (!this.pool) {
      throw new DatabaseError('Database not connected');
    }

    try {
      const start = Date.now();
      const result = await this.pool.query(query, values);
      const duration = Date.now() - start;

      // Log slow queries
      if (duration > 1000) {
        console.warn('Slow query detected:', { query, duration, values });
      }

      return result;
    } catch (error) {
      this.logError(error as Error, { query, values });
      throw new DatabaseError(`Query failed: ${(error as Error).message}`);
    }
  }

  private buildWhereClause(conditions: any): { whereClause: string; values: any[] } {
    if (!conditions || Object.keys(conditions).length === 0) {
      return { whereClause: '', values: [] };
    }

    const clauses: string[] = [];
    const values: any[] = [];

    Object.entries(conditions).forEach(([key, value], index) => {
      if (value === null) {
        clauses.push(`${key} IS NULL`);
      } else if (Array.isArray(value)) {
        const placeholders = value.map((_, i) => `$${values.length + i + 1}`).join(', ');
        clauses.push(`${key} IN (${placeholders})`);
        values.push(...value);
      } else {
        clauses.push(`${key} = $${values.length + 1}`);
        values.push(value);
      }
    });

    return {
      whereClause: `WHERE ${clauses.join(' AND ')}`,
      values
    };
  }
}
