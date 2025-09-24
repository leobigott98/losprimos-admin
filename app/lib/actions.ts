'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { pool } from '../config/mysql';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { FieldPacket, QueryResult, RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'

const FillingsFormSchema = z.object({
    sabor_id: z.number(),
    sabor_nombre: z.string(),
    sabor_disponible: z.number(),
    sabor_categoria: z.enum(['normal', 'mar', 'refresco', 'lipton']),
    creado: z.date(),
    actualizado: z.date(),
})

const CreateFilling = FillingsFormSchema.omit({sabor_id: true, sabor_disponible: true, creado: true, actualizado: true});

export async function createFilling(
  prevState: string | undefined,
  formData: FormData
): Promise<string> {
    const { sabor_nombre, sabor_categoria} = CreateFilling.parse({
        sabor_nombre: formData.get('sabor_nombre'),
        sabor_categoria: formData.get('sabor_categoria'),
    })

    try {
        const [response]: [RowDataPacket[][], FieldPacket[]] = await pool.query('CALL add_sabor(?, ?)', [sabor_nombre, sabor_categoria]);
        const result: RowDataPacket = response[0][0];
        return result.results as string
    } catch (error) {
        console.error('Database Error:', error);
        return 'Fallo del sistema'
        //throw new Error('Failed to create new filling.');
    }
    //revalidatePath('/dashboard/fillings');
    //redirect('/dashboard/fillings');
}

const DeliveryZonesFormSchema = z.object({
    zona_id: z.number(),
    zona_nombre: z.string(),
    zona_cod: z.string(),
    zona_precio: z.number(),
    status_valor: z.enum(['1', '2']),
    create_at: z.date(),
    actualizado: z.date(),
})

const CreateDeliveryZone = DeliveryZonesFormSchema.omit({zona_id: true, zona_cod: true, create_at: true, actualizado: true, status_valor: true});

export async function createDeliveryZone(
  prevState: string | undefined,
  formData: FormData
): Promise<string> {
    const { zona_nombre, zona_precio} = CreateDeliveryZone.parse({
        zona_nombre: formData.get('zona_nombre'),
        zona_precio: formData.get('zona_precio'),
    })

    try {
        const [response]: [RowDataPacket[][], FieldPacket[]] = await pool.query('CALL add_zona(?, ?)', [zona_nombre, zona_precio]);
        const result: RowDataPacket = response[0][0];
        return result.results as string
    } catch (error) {
        console.error('Database Error:', error);
        return 'Fallo del sistema'
        //throw new Error('Failed to create new filling.');
    }
    //revalidatePath('/dashboard/fillings');
    //redirect('/dashboard/fillings');
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

export async function toggleDeliveryZoneStatus(id: number, currentValue: number) {
  try {
    const newValue = currentValue === 1 ? 2 : 1;
    await pool.query('UPDATE p_zonas SET status_valor = ?, actualizado = (NOW() - INTERVAL 240 MINUTE) WHERE zona_id = ?', [newValue, id]);
    revalidatePath('/dashboard/delivery'); // Refresh table
  } catch (error) {
    console.error('DB Error:', error);
    throw new Error('Failed to toggle status.');
  }
}

export async function updateOrderStatus( formData: FormData){
  const orderNum = formData.get('orderNum') as string;
  const statusId = formData.get('statusId') as string;

  try {
    await pool.query('CALL update_ordenes(?, ?)', [orderNum, statusId])
  } catch (error) {
    console.error('Order Update Error:', error);
    throw new Error('Failed to update order status.');
  }
}
