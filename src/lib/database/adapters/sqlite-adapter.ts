// SQLite Database Adapter
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { 
  BaseDatabaseAdapter, 
  DatabaseConfig, 
  QueryResult, 
  TransactionContext,
  DatabaseError 
} from './base-adapter';

export class SQLiteAdapter extends BaseDatabaseAdapter {
  private db: Database.Database | null = null;
  private activeTransactions: Map<string, Database.Transaction> = new Map();

  async connect(): Promise<void> {
    try {
      const dbPath = this.config.database || './data/matrimony.db';
      
      // Ensure directory exists
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      this.db = new Database(dbPath, {
        verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
        ...this.config.options
      });

      // Enable foreign keys
      this.db.exec('PRAGMA foreign_keys = ON');
      this.db.exec('PRAGMA journal_mode = WAL');
      this.db.exec('PRAGMA synchronous = NORMAL');

      this.isConnected = true;
      console.log('SQLite connected successfully');
    } catch (error) {
      this.logError(error as Error, { config: this.config });
      throw new DatabaseError(`Failed to connect to SQLite: ${(error as Error).message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isConnected = false;
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      if (!this.db) return false;
      this.db.exec('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  async create<T>(table: string, data: Partial<T>): Promise<QueryResult<T>> {
    try {
      if (!this.db) throw new Error('Database not connected');
      
      const sanitizedData = this.sanitizeInput(data);
      const columns = Object.keys(sanitizedData);
      const values = Object.values(sanitizedData);
      const placeholders = columns.map(() => '?').join(', ');

      const query = `
        INSERT INTO ${table} (${columns.join(', ')})
        VALUES (${placeholders})
      `;

      const stmt = this.db.prepare(query);
      const result = stmt.run(...values);
      
      // Get the inserted record
      const selectStmt = this.db.prepare(`SELECT * FROM ${table} WHERE rowid = ?`);
      const insertedRecord = selectStmt.get(result.lastInsertRowid);

      return {
        data: insertedRecord as T,
        metadata: { insertedId: result.lastInsertRowid }
      };
    } catch (error) {
      this.logError(error as Error, { table, data });
      return { data: null, error: (error as Error).message };
    }
  }

  async findOne<T>(table: string, conditions: any): Promise<QueryResult<T>> {
    try {
      if (!this.db) throw new Error('Database not connected');
      
      const { whereClause, values } = this.buildWhereClause(conditions);
      const query = `SELECT * FROM ${table} ${whereClause} LIMIT 1`;
      
      const stmt = this.db.prepare(query);
      const result = stmt.get(...values);
      
      return {
        data: result as T || null
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
      if (!this.db) throw new Error('Database not connected');
      
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
        query += ` LIMIT ?`;
        values.push(options.limit);
      }

      if (options?.offset) {
        query += ` OFFSET ?`;
        values.push(options.offset);
      }

      const stmt = this.db.prepare(query);
      const results = stmt.all(...values);
      
      return {
        data: results as T[],
        count: results.length
      };
    } catch (error) {
      this.logError(error as Error, { table, conditions, options });
      return { data: [], error: (error as Error).message };
    }
  }

  async update<T>(table: string, conditions: any, data: Partial<T>): Promise<QueryResult<T>> {
    try {
      if (!this.db) throw new Error('Database not connected');
      
      const sanitizedData = this.sanitizeInput(data);
      const { whereClause, values: whereValues } = this.buildWhereClause(conditions);
      
      const setClause = Object.keys(sanitizedData)
        .map(key => `${key} = ?`)
        .join(', ');
      
      const values = [...Object.values(sanitizedData), ...whereValues];
      
      const query = `
        UPDATE ${table} 
        SET ${setClause}, updated_at = datetime('now')
        ${whereClause}
      `;

      const stmt = this.db.prepare(query);
      const result = stmt.run(...values);
      
      // Get the updated record
      const selectStmt = this.db.prepare(`SELECT * FROM ${table} ${whereClause}`);
      const updatedRecord = selectStmt.get(...whereValues);
      
      return {
        data: updatedRecord as T,
        count: result.changes
      };
    } catch (error) {
      this.logError(error as Error, { table, conditions, data });
      return { data: null, error: (error as Error).message };
    }
  }

  async delete(table: string, conditions: any): Promise<QueryResult<boolean>> {
    try {
      if (!this.db) throw new Error('Database not connected');
      
      const { whereClause, values } = this.buildWhereClause(conditions);
      const query = `DELETE FROM ${table} ${whereClause}`;
      
      const stmt = this.db.prepare(query);
      const result = stmt.run(...values);
      
      return {
        data: result.changes > 0,
        count: result.changes
      };
    } catch (error) {
      this.logError(error as Error, { table, conditions });
      return { data: false, error: (error as Error).message };
    }
  }

  async count(table: string, conditions?: any): Promise<number> {
    try {
      if (!this.db) throw new Error('Database not connected');
      
      let query = `SELECT COUNT(*) as count FROM ${table}`;
      let values: any[] = [];

      if (conditions) {
        const { whereClause, values: whereValues } = this.buildWhereClause(conditions);
        query += ` ${whereClause}`;
        values = whereValues;
      }

      const stmt = this.db.prepare(query);
      const result = stmt.get(...values) as { count: number };
      return result.count;
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
      if (!this.db) throw new Error('Database not connected');
      
      const searchConditions = fields.map(field => 
        `${field} LIKE ?`
      ).join(' OR ');
      
      const values = fields.map(() => `%${searchTerm}%`);
      
      let query = `SELECT * FROM ${table} WHERE ${searchConditions}`;
      
      if (options?.limit) {
        query += ` LIMIT ?`;
        values.push(options.limit);
      }

      if (options?.offset) {
        query += ` OFFSET ?`;
        values.push(options.offset);
      }

      const stmt = this.db.prepare(query);
      const results = stmt.all(...values);
      
      return {
        data: results as T[],
        count: results.length
      };
    } catch (error) {
      this.logError(error as Error, { table, searchTerm, fields });
      return { data: [], error: (error as Error).message };
    }
  }

  async beginTransaction(): Promise<TransactionContext> {
    try {
      if (!this.db) throw new Error('Database not connected');
      
      const transactionId = this.generateId();
      const transaction = this.db.transaction(() => {
        // Transaction will be executed when called
      });
      
      this.activeTransactions.set(transactionId, transaction);
      
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
      const transaction = this.activeTransactions.get(context.id);
      if (!transaction) throw new Error('Transaction not found');
      
      // SQLite transactions are auto-committed when the transaction function completes
      this.activeTransactions.delete(context.id);
    } catch (error) {
      throw new DatabaseError(`Failed to commit transaction: ${(error as Error).message}`);
    }
  }

  async rollbackTransaction(context: TransactionContext): Promise<void> {
    try {
      const transaction = this.activeTransactions.get(context.id);
      if (!transaction) throw new Error('Transaction not found');
      
      // SQLite transactions are auto-rolled back on error
      this.activeTransactions.delete(context.id);
    } catch (error) {
      throw new DatabaseError(`Failed to rollback transaction: ${(error as Error).message}`);
    }
  }

  async createTable(tableName: string, schema: any): Promise<void> {
    if (!this.db) throw new Error('Database not connected');
    
    // Implementation for creating tables dynamically
    throw new Error('Dynamic table creation not implemented for SQLite');
  }

  async dropTable(tableName: string): Promise<void> {
    if (!this.db) throw new Error('Database not connected');
    this.db.exec(`DROP TABLE IF EXISTS ${tableName}`);
  }

  async addColumn(tableName: string, columnName: string, columnType: any): Promise<void> {
    if (!this.db) throw new Error('Database not connected');
    this.db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`);
  }

  async removeColumn(tableName: string, columnName: string): Promise<void> {
    // SQLite doesn't support DROP COLUMN directly
    throw new Error('Column removal not supported in SQLite');
  }

  async createIndex(tableName: string, columns: string[], options?: {
    unique?: boolean;
    name?: string;
  }): Promise<void> {
    if (!this.db) throw new Error('Database not connected');
    
    const indexName = options?.name || `idx_${tableName}_${columns.join('_')}`;
    const uniqueClause = options?.unique ? 'UNIQUE' : '';
    const query = `CREATE ${uniqueClause} INDEX ${indexName} ON ${tableName} (${columns.join(', ')})`;
    
    this.db.exec(query);
  }

  async dropIndex(tableName: string, indexName: string): Promise<void> {
    if (!this.db) throw new Error('Database not connected');
    this.db.exec(`DROP INDEX IF EXISTS ${indexName}`);
  }

  async aggregate(table: string, pipeline: any[]): Promise<QueryResult<any>> {
    // SQLite doesn't have MongoDB-style aggregation, implement custom logic
    throw new Error('Aggregation pipeline not implemented for SQLite');
  }

  async backup(options?: { tables?: string[]; format?: string }): Promise<string> {
    if (!this.db) throw new Error('Database not connected');
    
    try {
      const backupPath = `./backups/backup_${Date.now()}.db`;
      const dir = path.dirname(backupPath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const backup = this.db.backup(backupPath);
      await backup.promise;
      
      return backupPath;
    } catch (error) {
      throw new DatabaseError(`Backup failed: ${(error as Error).message}`);
    }
  }

  async restore(backupData: string, options?: { overwrite?: boolean }): Promise<void> {
    // Implementation would restore from backup file
    throw new Error('Restore not implemented for SQLite adapter');
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
        created_at: operation.timestamp.toISOString()
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
    return {
      connectionCount: this.isConnected ? 1 : 0,
      queryCount: 0,
      averageQueryTime: 0,
      slowQueries: []
    };
  }

  // Helper Methods
  private buildWhereClause(conditions: any): { whereClause: string; values: any[] } {
    if (!conditions || Object.keys(conditions).length === 0) {
      return { whereClause: '', values: [] };
    }

    const clauses: string[] = [];
    const values: any[] = [];

    Object.entries(conditions).forEach(([key, value]) => {
      if (value === null) {
        clauses.push(`${key} IS NULL`);
      } else if (Array.isArray(value)) {
        const placeholders = value.map(() => '?').join(', ');
        clauses.push(`${key} IN (${placeholders})`);
        values.push(...value);
      } else {
        clauses.push(`${key} = ?`);
        values.push(value);
      }
    });

    return {
      whereClause: `WHERE ${clauses.join(' AND ')}`,
      values
    };
  }
}
