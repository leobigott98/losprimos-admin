'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { pool } from '../config/mysql';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

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