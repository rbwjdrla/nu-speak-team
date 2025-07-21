
const { Pool } = require('pg');

require('dotenv').config();

console.log('DATABASE_URL from .env:', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
 