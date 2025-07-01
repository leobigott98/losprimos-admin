import postgres from 'postgres';
import { pool } from '../config/mysql';
import {
  ClienteTable,
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  OrdenesTable,
  Revenue,
} from './definitions';
import {
  Cliente,
  Ordenes
} from './definitions'
import { FieldPacket, QueryResult, RowDataPacket } from 'mysql2'

import { formatCurrency } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const ITEMS_PER_PAGE = 6;

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
      `SELECT BIN_TO_UUID(ordenes.orden_id) AS id, clientes.cliente_nombre AS name, orden_num AS order_num, cliente_telefono AS phone, orden_detalle AS detail, orden_total AS amount, orden_status AS status, create_at AS created_at 
      FROM ordenes
      LEFT JOIN clientes ON ordenes.cliente_telefono = clientes.cliente_id
       WHERE (
        LOWER(clientes.cliente_nombre) LIKE ? OR
        LOWER(ordenes.orden_num) LIKE ? OR 
        LOWER(ordenes.cliente_telefono) LIKE ? OR 
        LOWER(ordenes.orden_detalle) LIKE ? OR 
        LOWER(ordenes.orden_total) LIKE ? OR 
        LOWER(ordenes.orden_status) LIKE ? OR 
        LOWER(ordenes.create_at) LIKE ?
      )
      ORDER BY ordenes.create_at DESC
      LIMIT ? OFFSET ?;`,
      [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, ITEMS_PER_PAGE, offset]
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
      `SELECT BIN_TO_UUID(ordenes.orden_id) AS id, clientes.cliente_nombre AS name, orden_num AS order_num, cliente_telefono AS phone, orden_detalle AS detail, orden_total AS amount, orden_status AS status, create_at AS created_at 
      FROM ordenes
      LEFT JOIN clientes ON ordenes.cliente_telefono = clientes.cliente_id
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

export async function fetchRevenue() {
  try {
    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

     console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}


export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
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

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
