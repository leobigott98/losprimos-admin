import Form from '@/app/ui/fillings/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
 
export default async function Page() {
 
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