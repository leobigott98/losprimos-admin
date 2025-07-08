import mysql from 'mysql2/promise'
import { Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';

const connector = new Connector();
const clientOpts = await connector.getOptions({
  instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME as string,
  ipType: "PUBLIC" as IpAddressTypes,
});
export const pool = mysql.createPool({
  ...clientOpts,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
});

