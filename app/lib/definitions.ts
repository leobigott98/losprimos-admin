// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

//declarar modelo de data nombre tabla campo:tipo
export type Cliente = {
  cliente_id: number;
  cliente_nombre: string;
  status_valor: number;
  creado: Date;
}

export type ClienteTable = {
  total_paid: number;
  phone: string,
  n_orders: number,
  cliente_nombre: string | null,
  created_at: Date | null
}

export type Menu = {
  menu_id: number;
  rest_valor: string;
  menu_descricion: string;
  menu_precio: number;
  cat_id: number;
  menu_disponibilidad: number;
  creado: Date;
  actualizado: Date;
}

export type Ordenes = {
  orden_id: number;
  orden_num: number;
  orden_fecha: Date;
  cliente_telefono: string;
  orden_detalle: string;
  orden_total: number;
  orden_status: string;
  create_at: Date;
}

export type OrdenesTable = {
  id: string;
  name: string;
  order_num: number;
  created_at: Date;
  phone: string;
  detail: string;
  amount: number;
  status: string | null;
} 

export type Sabores = {
  sabor_id: number;
  sabor_nombre: string;
  sabor_disponible: number;
  sabor_categoria: 'normal' | 'mar';
  creado: Date;
  actualizado: Date;
}

export type Status = {
  status_id: number;
  status_tipo: string;
  status_valor: number;
  status_nombre: string;
  status_descripcion: Date;
  creado: Date;
}

export type Usuarios = {
  usuario_id: number;
  usuario_nombre: string;
  usuario_apellido: string;
  usuario_email: string;
  usuario_clave: string;
  status_valor: number;
  creado: Date;
  actualizado: Date;
}

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  phone: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
