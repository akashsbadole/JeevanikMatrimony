// Base Database Adapter Interface
// Provides abstraction for multiple database types

export interface DatabaseConfig {
  type: 'postgresql' | 'mongodb' | 'sqlite';
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  ssl?: boolean;
  options?: Record<string, any>;
}

export interface QueryResult<T = any> {
  data: T | T[] | null;
  error?: string;
  count?: number;
  metadata?: Record<string, any>;
}

export interface TransactionContext {
  id: string;
  isActive: boolean;
  operations: Array<{
    type: 'insert' | 'update' | 'delete' | 'select';
    table: string;
    data?: any;
    conditions?: any;
  }>;
}

export abstract class BaseDatabaseAdapter {
  protected config: DatabaseConfig;
  protected connection: any;
  protected isConnected: boolean = false;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  // Connection Management
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract isHealthy(): Promise<boolean>;

  // Basic CRUD Operations
  abstract create<T>(table: string, data: Partial<T>): Promise<QueryResult<T>>;
  abstract findOne<T>(table: string, conditions: any): Promise<QueryResult<T>>;
  abstract findMany<T>(table: string, conditions?: any, options?: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    select?: string[];
  }): Promise<QueryResult<T[]>>;
  abstract update<T>(table: string, conditions: any, data: Partial<T>): Promise<QueryResult<T>>;
  abstract delete(table: string, conditions: any): Promise<QueryResult<boolean>>;

  // Advanced Operations
  abstract count(table: string, conditions?: any): Promise<number>;
  abstract exists(table: string, conditions: any): Promise<boolean>;
  abstract search<T>(table: string, searchTerm: string, fields: string[], options?: {
    limit?: number;
    offset?: number;
  }): Promise<QueryResult<T[]>>;

  // Transaction Support
  abstract beginTransaction(): Promise<TransactionContext>;
  abstract commitTransaction(context: TransactionContext): Promise<void>;
  abstract rollbackTransaction(context: TransactionContext): Promise<void>;

  // Schema Management
  abstract createTable(tableName: string, schema: any): Promise<void>;
  abstract dropTable(tableName: string): Promise<void>;
  abstract addColumn(tableName: string, columnName: string, columnType: any): Promise<void>;
  abstract removeColumn(tableName: string, columnName: string): Promise<void>;

  // Indexing
  abstract createIndex(tableName: string, columns: string[], options?: {
    unique?: boolean;
    name?: string;
  }): Promise<void>;
  abstract dropIndex(tableName: string, indexName: string): Promise<void>;

  // Aggregation
  abstract aggregate(table: string, pipeline: any[]): Promise<QueryResult<any>>;

  // Backup and Restore
  abstract backup(options?: { tables?: string[]; format?: string }): Promise<string>;
  abstract restore(backupData: string, options?: { overwrite?: boolean }): Promise<void>;

  // Security Features
  abstract encryptField(value: string, field: string): Promise<string>;
  abstract decryptField(encryptedValue: string, field: string): Promise<string>;
  abstract hashPassword(password: string): Promise<string>;
  abstract verifyPassword(password: string, hash: string): Promise<boolean>;

  // Audit Logging
  abstract logOperation(operation: {
    type: string;
    table: string;
    userId?: string;
    data?: any;
    timestamp: Date;
    ipAddress?: string;
  }): Promise<void>;

  // Performance Monitoring
  abstract getPerformanceMetrics(): Promise<{
    connectionCount: number;
    queryCount: number;
    averageQueryTime: number;
    slowQueries: Array<{
      query: string;
      duration: number;
      timestamp: Date;
    }>;
  }>;

  // Utility Methods
  protected sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      return input.replace(/[<>\"'%;()&+]/g, '');
    }
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }
    return input;
  }

  protected validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  protected validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  protected generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  protected logError(error: Error, context?: any): void {
    console.error('Database Error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  // Connection Status
  getConnectionStatus(): {
    isConnected: boolean;
    config: Omit<DatabaseConfig, 'password'>;
    lastConnected?: Date;
  } {
    return {
      isConnected: this.isConnected,
      config: {
        ...this.config,
        password: this.config.password ? '***' : undefined,
      },
    };
  }
}

// Database Factory
export class DatabaseFactory {
  private static adapters: Map<string, BaseDatabaseAdapter> = new Map();

  static async createAdapter(config: DatabaseConfig): Promise<BaseDatabaseAdapter> {
    const key = `${config.type}_${config.database || 'default'}`;
    
    if (this.adapters.has(key)) {
      return this.adapters.get(key)!;
    }

    let adapter: BaseDatabaseAdapter;

    switch (config.type) {
      case 'postgresql':
        const { PostgreSQLAdapter } = await import('./postgresql-adapter');
        adapter = new PostgreSQLAdapter(config);
        break;
      
      case 'mongodb':
        const { MongoDBAdapter } = await import('./mongodb-adapter');
        adapter = new MongoDBAdapter(config);
        break;
      
      case 'sqlite':
        const { SQLiteAdapter } = await import('./sqlite-adapter');
        adapter = new SQLiteAdapter(config);
        break;
      
      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }

    await adapter.connect();
    this.adapters.set(key, adapter);
    
    return adapter;
  }

  static async getAdapter(type: string, database?: string): Promise<BaseDatabaseAdapter> {
    const key = `${type}_${database || 'default'}`;
    const adapter = this.adapters.get(key);
    
    if (!adapter) {
      throw new Error(`No adapter found for ${key}`);
    }
    
    return adapter;
  }

  static async closeAllConnections(): Promise<void> {
    const promises = Array.from(this.adapters.values()).map(adapter => 
      adapter.disconnect().catch(console.error)
    );
    
    await Promise.all(promises);
    this.adapters.clear();
  }
}

// Error Classes
export class DatabaseError extends Error {
  constructor(message: string, public code?: string, public details?: any) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string, public value?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ConnectionError extends Error {
  constructor(message: string, public config?: DatabaseConfig) {
    super(message);
    this.name = 'ConnectionError';
  }
}
