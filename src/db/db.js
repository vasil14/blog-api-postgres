const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "test123",
  host: "localhost",
  port: 5432,
  database: "blog_app",
});

module.exports = pool;
