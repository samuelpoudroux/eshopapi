const mysql = require('mysql');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.PASSWORD,
    insecureAuth : true,
    database: process.env.DATABASE
  });

module.exports = db