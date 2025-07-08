import mysql from 'mysql2/promise'
import { Connector } from '@google-cloud/cloud-sql-connector';

const instaceConnectionName = process.env.INSTANCE_CONNECTION_NAME || ''

// connectWithConnector initializes a connection pool for a Cloud SQL instance
// of MySQL using the Cloud SQL Node.js Connector.
export const pool = async () => {
  const connector = new Connector();
  const clientOpts = await connector.getOptions({
    instanceConnectionName: instaceConnectionName,
  });
  const dbConfig = {
    ...clientOpts,
    user: process.env.MYSQL_USER, // e.g. 'my-db-user'
    password: process.env.MYSQL_PASSWORD, // e.g. 'my-db-password'
    database: process.env.MYSQL_DB, // e.g. 'my-database'
  };
  // Establish a connection to the database.
  return mysql.createPool(dbConfig);
};

