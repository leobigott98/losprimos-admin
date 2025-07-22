import { revalidatePath } from 'next/cache';

export async function POST(request: Request){
    revalidatePath('/dashboard/invoices');
    revalidatePath('/dashboard');

    return new Response(JSON.stringify({ message: 'Pages revalidated successfully!' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
    });

}