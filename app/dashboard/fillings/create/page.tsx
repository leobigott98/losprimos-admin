import Form from '@/app/ui/fillings/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Sabores', href: '/dashboard/fillings' },
          {
            label: 'Agregar Sabor',
            href: '/dashboard/fillings/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}