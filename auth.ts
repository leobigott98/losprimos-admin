import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User, Usuarios } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { pool } from '@/app/config/mysql';
import { QueryResult, FieldPacket } from 'mysql2';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
async function getUser(email: string): Promise<Usuarios | undefined> {
  try {
     const [response]: [QueryResult, FieldPacket[]] = await pool.query('SELECT * FROM usuarios WHERE usuario_email=?', [email]);
     const users: Usuarios[] = response as Usuarios[];
     return(users[0]);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.usuario_clave);
 
          if (passwordsMatch && user.status_valor === 1) return {
            id: user.usuario_id.toString(),
            email: user.usuario_email,
            name: `${user.usuario_nombre} ${user.usuario_apellido}`,
          }
        }
 
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});