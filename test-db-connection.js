const postgres = require('postgres');

const connectionString = process.env.DATABASE_URL;
console.log('Attempting to connect to:', connectionString?.substring(0, 30) + '...');

const sql = postgres(connectionString, {
  prepare: false,
  ssl: 'require',
  connect_timeout: 10
});

async function testConnection() {
  try {
    const result = await sql`SELECT version()`;
    console.log('✅ Database connection successful!');
    console.log('PostgreSQL version:', result[0].version);
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error code:', error.code);
    process.exit(1);
  }
}

testConnection();
