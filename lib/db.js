import pg from "pg";

const { Pool } = pg;

const pool = new Pool({

  user: "postgres",

  host: "localhost",

  database: "hospital_management",

  password: "yash@200",

  port: 5432,
});

export default pool;