import Form from '@/app/ui/invoices/view-detail';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchOrderById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { OrdenesTable } from '@/app/lib/definitions';
 
export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const [order]: OrdenesTable[] = await fetchOrderById(id);

    if (!order){
      notFound();
    }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Órdenes', href: '/dashboard/invoices' },
          {
            label: `Orden ${order.order_num}`,
            href: `/dashboard/invoices/${id}`,
            active: true,
          },
        ]}
      />
      <Form order={order} />
    </main>
  );
}