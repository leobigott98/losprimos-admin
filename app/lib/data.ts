import { pool } from '../config/mysql';
import {
  ClienteTable,
  LatestInvoice,
  LatestInvoiceRaw,
  OrdenesTable,
  Revenue,
  Sabores,
} from './definitions';
import {
  Cliente,
  Ordenes
} from './definitions'
import { FieldPacket, QueryResult, RowDataPacket } from 'mysql2'

import { formatCurrency } from './utils';

const ITEMS_PER_PAGE = 10;

// Fetch customers
export async function fetchClientes() {
  try{
    const [response]: [RowDataPacket[][], FieldPacket[]] = await pool.query('call get_clientes()');
    const customers: Cliente[] = response[0] as Cliente[];
    return(customers);
  } catch (error){
    console.log(error);
    throw new Error('Failed to fetch customers');
  }
}

export async function fetchFilteredClientes(
  query: string,
  currentPage: number,
){
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const searchTerm = `%${query.toLowerCase()}%`
    const [response]: [QueryResult, FieldPacket[]] = await pool.query(
      `SELECT SUM(orden_total) AS 'total_paid', cliente_telefono AS 'phone', COUNT(orden_id) AS 'n_orders', cliente_nombre, clientes.creado AS created_at 
      FROM ordenes
      LEFT JOIN clientes ON ordenes.cliente_telefono = clientes.cliente_id
       WHERE (
        LOWER(cliente_nombre) LIKE ? OR
        LOWER(cliente_telefono) LIKE ?
      )
      GROUP BY cliente_telefono
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?;`,
      [searchTerm, searchTerm, ITEMS_PER_PAGE, offset]
    );
    const customers: ClienteTable[] = response as ClienteTable[];
    return(customers);
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch filtered customers')
  }
}

export async function fetchClientesPages(query: string) {
  try {
    const searchTerm = `%${query.toLowerCase()}%`;

    const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      `SELECT COUNT(*) AS total FROM (
        SELECT SUM(orden_total) AS 'total_paid', cliente_telefono AS 'phone', COUNT(orden_id) AS 'n_orders', cliente_nombre, clientes.creado AS created_at 
        FROM ordenes
        LEFT JOIN clientes ON ordenes.cliente_telefono = clientes.cliente_id
        WHERE (
          LOWER(clientes.cliente_nombre) LIKE ? OR
          LOWER(clientes.cliente_id) LIKE ? OR
          LOWER(clientes.creado) LIKE ?
        )
        GROUP BY cliente_telefono
        ORDER BY created_at DESC
        ) n_clientes ;`, 
      [searchTerm, searchTerm, searchTerm]
    );

    const totalRows = rows[0].total as number;
    const totalPages = Math.ceil(totalRows / ITEMS_PER_PAGE);
    return totalPages; 
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }
}

// Fetch orders
export async function fetchOrders() {
  try{
    const [response]: [RowDataPacket[][], FieldPacket[]] = await pool.query('call get_ordenes()');
    const orders: Ordenes[] = response[0] as Ordenes[];
    return(orders);
  } catch (error){
    console.log(error);
    throw new Error('Failed to fetch orders');
  }
}

export async function fetchFilteredOrders(
  query: string,
  currentPage: number
){
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const searchTerm = `%${query.toLowerCase()}%`
    const [response]: [QueryResult, FieldPacket[]] = await pool.query(
      `SELECT BIN_TO_UUID(ordenes.orden_id) AS id, clientes.cliente_nombre AS name, orden_num AS order_num, cliente_telefono AS phone, orden_detalle AS detail, orden_total AS amount, orden_status AS payment, p_status.status_nombre AS status, ordenes.status_valor, create_at AS created_at 
      FROM ordenes
      LEFT JOIN clientes ON ordenes.cliente_telefono = clientes.cliente_id
      LEFT JOIN p_status ON ordenes.status_valor = p_status.status_valor
       WHERE (
        p_status.status_tipo = 'ordenes' AND (
        LOWER(clientes.cliente_nombre) LIKE ? OR
        LOWER(ordenes.orden_num) LIKE ? OR 
        LOWER(ordenes.cliente_telefono) LIKE ? OR 
        LOWER(ordenes.orden_detalle) LIKE ? OR 
        LOWER(ordenes.orden_total) LIKE ? OR 
        LOWER(ordenes.orden_status) LIKE ? OR 
        LOWER(p_status.status_nombre) LIKE ? OR
        LOWER(ordenes.create_at) LIKE ?
    )
      )
      ORDER BY ordenes.create_at DESC
      LIMIT ? OFFSET ?;`,
      [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, ITEMS_PER_PAGE, offset]
    );
    const orders: OrdenesTable[] = response as OrdenesTable[];
    return(orders);
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch filtered customers')
  }
}

export async function fetchOrdersPages(query: string) {
  try {
    const searchTerm = `%${query.toLowerCase()}%`;

    const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      `SELECT COUNT(*) AS total FROM (
        SELECT BIN_TO_UUID(ordenes.orden_id) AS id, clientes.cliente_nombre AS name, orden_num AS order_num, cliente_telefono AS phone, orden_detalle AS detail, orden_total AS amount, orden_status AS status, create_at AS created_at 
      FROM ordenes
      LEFT JOIN clientes ON ordenes.cliente_telefono = clientes.cliente_id
       WHERE (
        LOWER(name) LIKE ? OR
        LOWER(orden_num) LIKE ? OR 
        LOWER(phone) LIKE ? OR 
        LOWER(detail) LIKE ? OR 
        LOWER(total) LIKE ? OR 
        LOWER(status) LIKE ? OR 
        LOWER(created_at) LIKE ? 
      )
      ORDER BY created_at DESC
        ) n_clientes ;`, 
      [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]
    );

    const totalRows = rows[0].total as number;
    const totalPages = Math.ceil(totalRows / ITEMS_PER_PAGE);
    return totalPages; 
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }
}

export async function fetchOrderById(id: string) {
  try {
    const [response]: [QueryResult, FieldPacket[]] = await pool.query(
      `SELECT BIN_TO_UUID(ordenes.orden_id) AS id, clientes.cliente_nombre AS name, orden_num AS order_num, cliente_telefono AS phone, orden_detalle AS detail, orden_total AS amount, orden_status AS payment, p_status.status_nombre AS status, ordenes.status_valor, create_at AS created_at, imagen AS image 
      FROM ordenes
      LEFT JOIN clientes ON ordenes.cliente_telefono = clientes.cliente_id
      LEFT JOIN p_status ON ordenes.status_valor = p_status.status_valor
      WHERE ordenes.orden_id = UUID_TO_BIN(?);`,
      [id]
    );

    const order: OrdenesTable[] = response as OrdenesTable[] ;
    return(order);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch order.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const searchTerm = `%${query.toLowerCase()}%`;

    const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      `SELECT COUNT(*) AS total
      FROM ordenes
      JOIN clientes ON ordenes.cliente_telefono = clientes.cliente_id
      WHERE (
        LOWER(clientes.cliente_nombre) LIKE ? OR
        LOWER(clientes.cliente_id) LIKE ? OR
        LOWER(ordenes.create_at) LIKE ? OR
        LOWER(ordenes.orden_total) LIKE ? OR
        LOWER(ordenes.orden_status) LIKE ? OR
        LOWER(ordenes.orden_num) LIKE ? OR
        LOWER(ordenes.orden_detalle) LIKE ?
      )`, 
      [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]
    );

    const totalRows = rows[0].total as number;
    const totalPages = Math.ceil(totalRows / ITEMS_PER_PAGE);
    return totalPages; 
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchRevenue() {
  try {
    const [response]: [RowDataPacket[], FieldPacket[]] = await pool.query(`
      SELECT date_format((create_at), '%h %p')  AS 'hour', COUNT(orden_id) AS 'orders'
      FROM ordenes
      WHERE create_at > NOW() - INTERVAL 60 DAY
      GROUP BY date_format((create_at), '%h %p');`);

    const revenue: Revenue[] = response as Revenue[] ;
    return(revenue);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const [response]: [RowDataPacket[], FieldPacket[]] = await pool.query(`
      SELECT BIN_TO_UUID(ordenes.orden_id) AS id, clientes.cliente_nombre AS name, clientes.cliente_id AS phone, ordenes.orden_total AS amount
      FROM ordenes
      JOIN clientes ON ordenes.cliente_telefono = clientes.cliente_id
      ORDER BY ordenes.create_at DESC
      LIMIT 5`);

    const orders: LatestInvoiceRaw[] = response as LatestInvoiceRaw[];

    const latestInvoices: LatestInvoice[] = orders.map((order) => ({
      ...order,
      amount: formatCurrency(order.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    const invoiceCountPromise: Promise<[RowDataPacket[], FieldPacket[]]> = pool.query('SELECT COUNT(*) AS count FROM ordenes;');
    const customerCountPromise: Promise<[RowDataPacket[], FieldPacket[]]> = pool.query('SELECT COUNT(*) AS count FROM clientes;');
    const invoiceStatusPromise: Promise<[RowDataPacket[], FieldPacket[]]> = pool.query(`SELECT 
	SUM(CASE WHEN orden_status = 'pagado' THEN orden_total ELSE 0 END) AS 'pagado',
    SUM(CASE WHEN orden_status = 'Pago Efectivo' THEN orden_total ELSE 0 END) AS 'efectivo',
    SUM(CASE WHEN orden_status != 'Pago Efectivo' AND orden_status != 'pagado' THEN orden_total ELSE 0 END) AS 'pendiente'
FROM ordenes;`);

    const [invoiceData, customerData, statusData] = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(invoiceData[0][0].count ?? '0');
    const numberOfCustomers = Number(customerData[0][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(statusData[0][0].pagado ?? '0');
    const totalCashInvoices = formatCurrency(statusData[0][0].efectivo ?? '0');
    const totalPendingInvoices = formatCurrency(statusData[0][0].pendiente ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalCashInvoices,
      totalPendingInvoices
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

// Fetch fillings
export async function fetchFillings() {
  try{
    const [response]: [RowDataPacket[], FieldPacket[]] = await pool.query('SELECT * FROM sabores;');
    const fillings: Sabores[] = response[0] as Sabores[];
    return(fillings);
  } catch (error){
    console.log(error);
    throw new Error('Failed to fetch fillings');
  }
}

export async function fetchFilteredFillings(
  query: string,
  currentPage: number,
){
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const searchTerm = `%${query.toLowerCase()}%`
    const [response]: [QueryResult, FieldPacket[]] = await pool.query(
      `SELECT * 
      FROM sabores
       WHERE (
        LOWER(sabor_nombre) LIKE ? OR
        LOWER(sabor_categoria) LIKE ?
      )
      ORDER BY creado DESC
      LIMIT ? OFFSET ?;`,
      [searchTerm, searchTerm, ITEMS_PER_PAGE, offset]
    );
    const fillings: Sabores[] = response as Sabores[];
    return(fillings);
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch filtered fillings')
  }
}

export async function fetchFillingsPages(query: string) {
  try {
    const searchTerm = `%${query.toLowerCase()}%`;

    const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      `SELECT COUNT(*) AS total FROM (
        SELECT * 
      FROM sabores
       WHERE (
        LOWER(sabor_nombre) LIKE ? OR
        LOWER(sabor_categoria) LIKE ?
      )) n_fillings ;`, 
      [searchTerm, searchTerm]
    );

    const totalRows = rows[0].total as number;
    const totalPages = Math.ceil(totalRows / ITEMS_PER_PAGE);
    return totalPages; 
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }
}