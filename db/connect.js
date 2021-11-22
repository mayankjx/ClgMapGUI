const mysql = require("mysql");

require("dotenv").config();

const mysqlConnection = mysql.createConnection({
  host: `remotemysql.com`,
  user: `qkrXnlSv0n`,
  password: `wNoVwmhiwE`,
  database: `qkrXnlSv0n`,
});

module.exports = mysqlConnection;
