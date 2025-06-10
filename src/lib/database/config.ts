// Database Configuration and Connection Manager
import { DatabaseFactory, DatabaseConfig, BaseDatabaseAdapter } from './adapters/base-adapter';

// Database configuration based on environment
export const getDatabaseConfig = (): DatabaseConfig => {
  const dbType = (process.env.DATABASE_TYPE as 'postgresql' | 'mongodb' | 'sqlite') || 'sqlite';
  
  switch (dbType) {
    case 'postgresql':
      return {
        type: 'postgresql',
        connectionString: process.env.DATABASE_URL,
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'matrimony',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        ssl: process.env.NODE_ENV === 'production',
        options: {
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        }
      };
    
    case 'mongodb':
      return {
        type: 'mongodb',
        connectionString: process.env.MONGODB_URI || 'mongodb://localhost:27017/matrimony',
        database: process.env.MONGODB_DB || 'matrimony',
        options: {
          maxPoolSize: 20,
          minPoolSize: 5,
          maxIdleTimeMS: 30000,
          serverSelectionTimeoutMS: 5000,
        }
      };
    
    case 'sqlite':
    default:
      return {
        type: 'sqlite',
        database: process.env.SQLITE_PATH || './data/matrimony.db',
        options: {
          verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
        }
      };
  }
};

// Global database instance
let dbInstance: BaseDatabaseAdapter | null = null;

// Get database instance (singleton pattern)
export const getDatabase = async (): Promise<BaseDatabaseAdapter> => {
  if (!dbInstance) {
    const config = getDatabaseConfig();
    dbInstance = await DatabaseFactory.createAdapter(config);
  }
  return dbInstance;
};

// Initialize database with schema
export const initializeDatabase = async (): Promise<void> => {
  const db = await getDatabase();
  
  try {
    // Create tables based on database type
    if (db.config.type === 'sqlite') {
      await initializeSQLiteSchema(db);
    } else if (db.config.type === 'postgresql') {
      await initializePostgreSQLSchema(db);
    } else if (db.config.type === 'mongodb') {
      await initializeMongoDBSchema(db);
    }
    
    console.log(`Database initialized successfully (${db.config.type})`);
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

// SQLite Schema Initialization
const initializeSQLiteSchema = async (db: BaseDatabaseAdapter): Promise<void> => {
  const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      email_verified BOOLEAN DEFAULT FALSE,
      phone_verified BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // User profiles table
    `CREATE TABLE IF NOT EXISTS user_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      profile_for TEXT NOT NULL DEFAULT 'self',
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      date_of_birth DATE NOT NULL,
      gender TEXT NOT NULL,
      marital_status TEXT NOT NULL,
      height INTEGER,
      weight INTEGER,
      body_type TEXT,
      complexion TEXT,
      physical_status TEXT,
      country TEXT,
      state TEXT,
      city TEXT,
      willing_to_relocate BOOLEAN DEFAULT FALSE,
      religion TEXT,
      caste TEXT,
      sub_caste TEXT,
      gothra TEXT,
      star_rashi TEXT,
      mother_tongue TEXT,
      known_languages TEXT,
      highest_education TEXT,
      education_institution TEXT,
      education_year INTEGER,
      occupation TEXT,
      designation TEXT,
      company_name TEXT,
      work_location TEXT,
      annual_income INTEGER,
      diet_preference TEXT,
      smoking_habit TEXT,
      drinking_habit TEXT,
      hobbies TEXT,
      about_me TEXT,
      partner_preferences TEXT,
      profile_photo TEXT,
      is_verified BOOLEAN DEFAULT FALSE,
      verification_score INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Family details table
    `CREATE TABLE IF NOT EXISTS family_details (
      id TEXT PRIMARY KEY,
      user_profile_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
      family_type TEXT,
      family_status TEXT,
      family_values TEXT,
      father_name TEXT,
      father_occupation TEXT,
      father_living BOOLEAN,
      mother_name TEXT,
      mother_occupation TEXT,
      mother_living BOOLEAN,
      brothers_count INTEGER DEFAULT 0,
      brothers_married INTEGER DEFAULT 0,
      sisters_count INTEGER DEFAULT 0,
      sisters_married INTEGER DEFAULT 0,
      family_income INTEGER,
      property_details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Horoscope details table
    `CREATE TABLE IF NOT EXISTS horoscope_details (
      id TEXT PRIMARY KEY,
      user_profile_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
      birth_time TIME,
      birth_place TEXT,
      birth_latitude REAL,
      birth_longitude REAL,
      kundli_url TEXT,
      kundli_verified BOOLEAN DEFAULT FALSE,
      sun_sign TEXT,
      moon_sign TEXT,
      ascendant TEXT,
      nakshatra TEXT,
      pada INTEGER,
      gana TEXT,
      nadi TEXT,
      yoni TEXT,
      vashya TEXT,
      varna TEXT,
      tara INTEGER,
      tithi INTEGER,
      karana TEXT,
      yoga TEXT,
      planetary_positions TEXT,
      manglik_dosha BOOLEAN DEFAULT FALSE,
      manglik_severity TEXT,
      kaal_sarp_dosha BOOLEAN DEFAULT FALSE,
      shani_dosha BOOLEAN DEFAULT FALSE,
      rahu_ketu_dosha BOOLEAN DEFAULT FALSE,
      remedies_suggested TEXT,
      guna_milan_score INTEGER,
      compatibility_notes TEXT,
      favorable_days TEXT,
      favorable_months TEXT,
      marriage_muhurat_suggestions TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // User interests table
    `CREATE TABLE IF NOT EXISTS user_interests (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      receiver_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      interest_type TEXT DEFAULT 'standard',
      message TEXT,
      status TEXT DEFAULT 'pending',
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      responded_at DATETIME,
      expires_at DATETIME,
      UNIQUE(sender_id, receiver_id)
    )`,
    
    // Messages table
    `CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      receiver_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      message_type TEXT DEFAULT 'text',
      content TEXT,
      media_url TEXT,
      voice_duration INTEGER,
      is_read BOOLEAN DEFAULT FALSE,
      read_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Audit logs table
    `CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      operation_type TEXT NOT NULL,
      table_name TEXT NOT NULL,
      user_id TEXT,
      operation_data TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  ];
  
  for (const table of tables) {
    await db.executeQuery?.(table);
  }
  
  // Create indexes
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
    'CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_user_profiles_gender_age ON user_profiles(gender, date_of_birth)',
    'CREATE INDEX IF NOT EXISTS idx_user_profiles_location ON user_profiles(country, state, city)',
    'CREATE INDEX IF NOT EXISTS idx_user_interests_sender ON user_interests(sender_id)',
    'CREATE INDEX IF NOT EXISTS idx_user_interests_receiver ON user_interests(receiver_id)',
    'CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id)',
    'CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id, created_at)'
  ];
  
  for (const index of indexes) {
    await db.executeQuery?.(index);
  }
};

// PostgreSQL Schema Initialization
const initializePostgreSQLSchema = async (db: BaseDatabaseAdapter): Promise<void> => {
  // PostgreSQL schema would be similar but with PostgreSQL-specific syntax
  // This would typically be handled by migrations in a production environment
  console.log('PostgreSQL schema initialization would be handled by migrations');
};

// MongoDB Schema Initialization
const initializeMongoDBSchema = async (db: BaseDatabaseAdapter): Promise<void> => {
  // MongoDB is schemaless, but we can create indexes
  const collections = [
    'users',
    'user_profiles', 
    'family_details',
    'horoscope_details',
    'user_interests',
    'messages',
    'audit_logs'
  ];
  
  for (const collection of collections) {
    await db.createIndex(collection, ['created_at']);
  }
  
  // Create specific indexes
  await db.createIndex('users', ['email'], { unique: true });
  await db.createIndex('user_profiles', ['user_id']);
  await db.createIndex('user_profiles', ['gender', 'date_of_birth']);
  await db.createIndex('user_interests', ['sender_id', 'receiver_id'], { unique: true });
  await db.createIndex('messages', ['conversation_id', 'created_at']);
};

// Close database connection
export const closeDatabase = async (): Promise<void> => {
  if (dbInstance) {
    await dbInstance.disconnect();
    dbInstance = null;
  }
};

// Health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const db = await getDatabase();
    return await db.isHealthy();
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

// Database migration utilities
export const runMigrations = async (): Promise<void> => {
  const db = await getDatabase();
  
  // Create migrations table if it doesn't exist
  if (db.config.type === 'sqlite') {
    await db.executeQuery?.(`
      CREATE TABLE IF NOT EXISTS migrations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  
  // Run pending migrations
  const migrations = [
    // Add migration files here
  ];
  
  for (const migration of migrations) {
    // Execute migration logic
  }
};

// Export database types for TypeScript
export type { DatabaseConfig, BaseDatabaseAdapter } from './adapters/base-adapter';
