import Form from '@/app/ui/delivery/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
 
export default async function Page() {
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Zonas de Delivery', href: '/dashboard/delivery' },
          {
            label: 'Agregar Zona',
            href: '/dashboard/delivery/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}