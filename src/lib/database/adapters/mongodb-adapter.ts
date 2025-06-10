// MongoDB Database Adapter
import { MongoClient, Db, Collection, ClientSession, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { 
  BaseDatabaseAdapter, 
  DatabaseConfig, 
  QueryResult, 
  TransactionContext,
  DatabaseError 
} from './base-adapter';

export class MongoDBAdapter extends BaseDatabaseAdapter {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private activeSessions: Map<string, ClientSession> = new Map();

  async connect(): Promise<void> {
    try {
      const uri = this.config.connectionString || 
        `mongodb://${this.config.username}:${this.config.password}@${this.config.host}:${this.config.port}/${this.config.database}`;

      this.client = new MongoClient(uri, {
        maxPoolSize: 20,
        minPoolSize: 5,
        maxIdleTimeMS: 30000,
        serverSelectionTimeoutMS: 5000,
        ...this.config.options
      });

      await this.client.connect();
      this.db = this.client.db(this.config.database);

      // Test connection
      await this.db.admin().ping();

      this.isConnected = true;
      console.log('MongoDB connected successfully');
    } catch (error) {
      this.logError(error as Error, { config: this.config });
      throw new DatabaseError(`Failed to connect to MongoDB: ${(error as Error).message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this.isConnected = false;
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      if (!this.db) return false;
      await this.db.admin().ping();
      return true;
    } catch {
      return false;
    }
  }

  async create<T>(table: string, data: Partial<T>): Promise<QueryResult<T>> {
    try {
      if (!this.db) throw new Error('Database not connected');
      
      const collection = this.db.collection(table);
      const sanitizedData = this.sanitizeInput(data);
      
      // Add timestamps
      const document = {
        ...sanitizedData,
        _id: new ObjectId(),
        created_at: new Date(),
        updated_at: new Date()
      };

      const result = await collection.insertOne(document);
      
      return {
        data: { ...document, id: document._id.toString() } as T,
        metadata: { insertedId: result.insertedId.toString() }
      };
    } catch (error) {
      this.logError(error as Error, { table, data });
      return { data: null, error: (error as Error).message };
    }
  }

  async findOne<T>(table: string, conditions: any): Promise<QueryResult<T>> {
    try {
      if (!this.db) throw new Error('Database not connected');
      
      const collection = this.db.collection(table);
      const mongoConditions = this.convertConditions(conditions);
      
      const result = await collection.findOne(mongoConditions);
      
      if (result) {
        result.id = result._id.toString();
        delete result._id;
      }
      
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
      
      const collection = this.db.collection(table);
      const mongoConditions = conditions ? this.convertConditions(conditions) : {};
      
      let cursor = collection.find(mongoConditions);

      // Apply projection
      if (options?.select) {
        const projection: any = {};
        options.select.forEach(field => {
          projection[field] = 1;
        });
        cursor = cursor.project(projection);
      }

      // Apply sorting
      if (options?.orderBy) {
        const sortDirection = options.orderDirection === 'desc' ? -1 : 1;
        cursor = cursor.sort({ [options.orderBy]: sortDirection });
      }

      // Apply pagination
      if (options?.offset) {
        cursor = cursor.skip(options.offset);
      }

      if (options?.limit) {
        cursor = cursor.limit(options.limit);
      }

      const results = await cursor.toArray();
      
      // Convert _id to id
      const convertedResults = results.map(doc => {
        doc.id = doc._id.toString();
        delete doc._id;
        return doc;
      });
      
      return {
        data: convertedResults as T[],
        count: convertedResults.length
      };
    } catch (error) {
      this.logError(error as Error, { table, conditions, options });
      return { data: [], error: (error as Error).message };
    }
  }

  async update<T>(table: string, conditions: any, data: Partial<T>): Promise<QueryResult<T>> {
    try {
      if (!this.db) throw new Error('Database not connected');
      
      const collection = this.db.collection(table);
      const mongoConditions = this.convertConditions(conditions);
      const sanitizedData = this.sanitizeInput(data);
      
      const updateDoc = {
        $set: {
          ...sanitizedData,
          updated_at: new Date()
        }
      };

      const result = await collection.findOneAndUpdate(
        mongoConditions,
        updateDoc,
        { returnDocument: 'after' }
      );
      
      if (result.value) {
        result.value.id = result.value._id.toString();
        delete result.value._id;
      }
      
      return {
        data: result.value as T,
        count: result.ok ? 1 : 0
      };
    } catch (error) {
      this.logError(error as Error, { table, conditions, data });
      return { data: null, error: (error as Error).message };
    }
  }

  async delete(table: string, conditions: any): Promise<QueryResult<boolean>> {
    try {
      if (!this.db) throw new Error('Database not connected');
      
      const collection = this.db.collection(table);
      const mongoConditions = this.convertConditions(conditions);
      
      const result = await collection.deleteMany(mongoConditions);
      
      return {
        data: result.deletedCount > 0,
        count: result.deletedCount
      };
    } catch (error) {
      this.logError(error as Error, { table, conditions });
      return { data: false, error: (error as Error).message };
    }
  }

  async count(table: string, conditions?: any): Promise<number> {
    try {
      if (!this.db) throw new Error('Database not connected');
      
      const collection = this.db.collection(table);
      const mongoConditions = conditions ? this.convertConditions(conditions) : {};
      
      return await collection.countDocuments(mongoConditions);
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
      
      const collection = this.db.collection(table);
      
      // Create text search conditions
      const searchConditions = {
        $or: fields.map(field => ({
          [field]: { $regex: searchTerm, $options: 'i' }
        }))
      };
      
      let cursor = collection.find(searchConditions);
      
      if (options?.offset) {
        cursor = cursor.skip(options.offset);
      }

      if (options?.limit) {
        cursor = cursor.limit(options.limit);
      }

      const results = await cursor.toArray();
      
      // Convert _id to id
      const convertedResults = results.map(doc => {
        doc.id = doc._id.toString();
        delete doc._id;
        return doc;
      });
      
      return {
        data: convertedResults as T[],
        count: convertedResults.length
      };
    } catch (error) {
      this.logError(error as Error, { table, searchTerm, fields });
      return { data: [], error: (error as Error).message };
    }
  }

  async beginTransaction(): Promise<TransactionContext> {
    try {
      if (!this.client) throw new Error('Database not connected');
      
      const session = this.client.startSession();
      session.startTransaction();
      
      const transactionId = this.generateId();
      this.activeSessions.set(transactionId, session);
      
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
      const session = this.activeSessions.get(context.id);
      if (!session) throw new Error('Transaction not found');
      
      await session.commitTransaction();
      await session.endSession();
      this.activeSessions.delete(context.id);
    } catch (error) {
      throw new DatabaseError(`Failed to commit transaction: ${(error as Error).message}`);
    }
  }

  async rollbackTransaction(context: TransactionContext): Promise<void> {
    try {
      const session = this.activeSessions.get(context.id);
      if (!session) throw new Error('Transaction not found');
      
      await session.abortTransaction();
      await session.endSession();
      this.activeSessions.delete(context.id);
    } catch (error) {
      throw new DatabaseError(`Failed to rollback transaction: ${(error as Error).message}`);
    }
  }

  async createTable(tableName: string, schema: any): Promise<void> {
    if (!this.db) throw new Error('Database not connected');
    
    // MongoDB creates collections automatically, but we can create indexes
    const collection = this.db.collection(tableName);
    
    // Create basic indexes
    await collection.createIndex({ created_at: 1 });
    await collection.createIndex({ updated_at: 1 });
  }

  async dropTable(tableName: string): Promise<void> {
    if (!this.db) throw new Error('Database not connected');
    await this.db.collection(tableName).drop();
  }

  async addColumn(tableName: string, columnName: string, columnType: any): Promise<void> {
    // MongoDB is schemaless, no need to add columns
    console.log(`MongoDB is schemaless, column ${columnName} will be added automatically when used`);
  }

  async removeColumn(tableName: string, columnName: string): Promise<void> {
    if (!this.db) throw new Error('Database not connected');
    
    // Remove field from all documents
    const collection = this.db.collection(tableName);
    await collection.updateMany({}, { $unset: { [columnName]: "" } });
  }

  async createIndex(tableName: string, columns: string[], options?: {
    unique?: boolean;
    name?: string;
  }): Promise<void> {
    if (!this.db) throw new Error('Database not connected');
    
    const collection = this.db.collection(tableName);
    const indexSpec: any = {};
    
    columns.forEach(column => {
      indexSpec[column] = 1;
    });
    
    const indexOptions: any = {};
    if (options?.unique) indexOptions.unique = true;
    if (options?.name) indexOptions.name = options.name;
    
    await collection.createIndex(indexSpec, indexOptions);
  }

  async dropIndex(tableName: string, indexName: string): Promise<void> {
    if (!this.db) throw new Error('Database not connected');
    
    const collection = this.db.collection(tableName);
    await collection.dropIndex(indexName);
  }

  async aggregate(table: string, pipeline: any[]): Promise<QueryResult<any>> {
    try {
      if (!this.db) throw new Error('Database not connected');
      
      const collection = this.db.collection(table);
      const results = await collection.aggregate(pipeline).toArray();
      
      return {
        data: results,
        count: results.length
      };
    } catch (error) {
      this.logError(error as Error, { table, pipeline });
      return { data: [], error: (error as Error).message };
    }
  }

  async backup(options?: { tables?: string[]; format?: string }): Promise<string> {
    // Implementation would use mongodump
    throw new Error('Backup not implemented for MongoDB adapter');
  }

  async restore(backupData: string, options?: { overwrite?: boolean }): Promise<void> {
    // Implementation would use mongorestore
    throw new Error('Restore not implemented for MongoDB adapter');
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
        operation_data: operation.data,
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
    // Implementation would query MongoDB system collections
    return {
      connectionCount: this.isConnected ? 1 : 0,
      queryCount: 0,
      averageQueryTime: 0,
      slowQueries: []
    };
  }

  // Helper Methods
  private convertConditions(conditions: any): any {
    const mongoConditions: any = {};
    
    Object.entries(conditions).forEach(([key, value]) => {
      if (key === 'id') {
        mongoConditions._id = new ObjectId(value as string);
      } else if (value === null) {
        mongoConditions[key] = null;
      } else if (Array.isArray(value)) {
        mongoConditions[key] = { $in: value };
      } else {
        mongoConditions[key] = value;
      }
    });
    
    return mongoConditions;
  }
}
