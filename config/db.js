import { Pool } from 'pg';

// ✅ Load environment variables only for non-production
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// ✅ Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Uses DATABASE_URL from .env.local
});

export { pool };
