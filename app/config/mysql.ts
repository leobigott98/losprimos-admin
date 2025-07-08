import mysql from 'mysql2/promise'

export const pool  = mysql.createPool({
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  socketPath: process.env.INSTANCE_UNIX_SOCKET
});

