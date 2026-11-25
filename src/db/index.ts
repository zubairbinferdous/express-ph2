import { Pool } from 'pg';
import { config } from '../config';
export const pool = new Pool({
  connectionString: config.connection_string
});

// console.log(pool);

export  const initDB = async()=>{
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL ,
      password VARCHAR(255) NOT NULL ,
      age int,
      is_Active BOOLEAN DEFAULT true,
      create_at TIMESTAMP DEFAULT NOW(),
      update_at TIMESTAMP DEFAULT NOW()
      );
      `)
    console.log('Database connection successful');
  } catch (error) {
    console.log(error);
  }
}
