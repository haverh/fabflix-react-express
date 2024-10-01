require('dotenv').config();

module.exports = {
  // LOCAL
  // pg_user: process.env.LOCAL_PG_USER,
  // pg_host: process.env.LOCAL_PG_HOST,
  // pg_database: process.env.LOCAL_PG_DATABASE,
  // pg_password: process.env.LOCAL_PG_PASSWORD,
  // pg_port: process.env.LOCAL_PG_PORT

  // VERCEL 
  // pg_user: process.env.POSTGRES_USER,
  // pg_host: process.env.POSTGRES_HOST,
  // pg_database: process.env.POSTGRES_DATABASE,
  // pg_password: process.env.POSTGRES_PASSWORD,

  // SUPABASE
  pg_user: process.env.SUPABASE_USER,
  pg_host: process.env.SUPABASE_HOST,
  pg_database: process.env.SUPABASE_DATABASE,
  pg_password: process.env.SUPABASE_PASSWORD,
  pg_port: process.env.SUPABASE_PORT,
}





