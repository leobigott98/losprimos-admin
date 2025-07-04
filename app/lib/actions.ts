'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { pool } from '../config/mysql';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { FieldPacket, QueryResult } from 'mysql2';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FillingsFormSchema = z.object({
    sabor_id: z.number(),
    sabor_nombre: z.string(),
    sabor_disponible: z.number(),
    sabor_categoria: z.enum(['normal', 'mar']),
    creado: z.date(),
    actualizado: z.date(),
})

const CreateFilling = FillingsFormSchema.omit({sabor_id: true, sabor_disponible: true, creado: true, actualizado: true});

export async function createFilling(formData: FormData) {
    const { sabor_nombre, sabor_categoria} = CreateFilling.parse({
        sabor_nombre: formData.get('sabor_nombre'),
        sabor_categoria: formData.get('sabor_categoria'),
    })

    try {
        const response = await pool.query('CALL add_sabor(?, ?)', [sabor_nombre, sabor_categoria]);
        console.log(response);
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create new filling.');
    }
    revalidatePath('/dashboard/fillings');
    redirect('/dashboard/fillings');
}

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
            customerId: formData.get('customerId'),
            amount : formData.get('amount'),
            status: formData.get('status'),
        })
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create new invoice.');
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
            customerId: formData.get('customerId'),
            amount: formData.get('amount'),
            status: formData.get('status'),
        });

    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
        
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update invoice.');
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        
    } catch (error) {
        console.log('Database error:', error);
        throw new Error('Failed to delete invoice');
    } 
    revalidatePath('/dashboad/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales Inválidas.';
        default:
          return 'Algo sucedió.';
      }
    }
    throw error;
  }
}

export async function registerUser(
  prevState: string | undefined,
  formData: FormData,
) {
  const nombre = formData.get('nombre') as string;
  const apellido = formData.get('apellido') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const schema = z.object({
    nombre: z.string().min(1),
    apellido: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const parsed = schema.safeParse({ nombre, apellido, email, password });
  if (!parsed.success) return 'Datos inválidos.';

  try {
    // Check if user already exists
    const [existing]: [QueryResult, FieldPacket[]] = await pool.query(
      'SELECT usuario_id FROM usuarios WHERE usuario_email = ?',
      [email]
    );
    if ((existing as any[]).length > 0) return 'Este email ya está registrado.';

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate user id
    const userId = uuidv4();

    // Insert user
    await pool.query(
      `INSERT INTO usuarios (usuario_id, usuario_nombre, usuario_apellido, usuario_email, usuario_clave, status_valor)
       VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, 3)`,
      [userId, nombre, apellido, email, hashedPassword]
    );

    return undefined; // No error
  } catch (err) {
    console.error(err);
    return 'Ocurrió un error en el servidor.';
  }
}

export async function toggleFillingAvailability(id: number, currentValue: number) {
  try {
    const newValue = currentValue === 1 ? 0 : 1;
    await pool.query('UPDATE sabores SET sabor_disponible = ?, actualizado = (NOW() - INTERVAL 240 MINUTE) WHERE sabor_id = ?', [newValue, id]);
    revalidatePath('/dashboard/fillings'); // Refresh table
  } catch (error) {
    console.error('DB Error:', error);
    throw new Error('Failed to toggle availability.');
  }
}
