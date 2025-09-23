export const dynamic = 'force-dynamic';

import {
  BanknotesIcon,
  DevicePhoneMobileIcon,
  ArchiveBoxXMarkIcon,
  ReceiptPercentIcon, 
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';

const iconMap = {
  total: ReceiptPercentIcon,
  pm: DevicePhoneMobileIcon,
  pos: CreditCardIcon,
  cancelled: ArchiveBoxXMarkIcon,
  cash: BanknotesIcon
};

export default async function CardWrapper() {
  const { totalCashInvoices, totalPmInvoices, totalPosInvoices, totalInvoices, cancelled} = await fetchCardData();
  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}

      <Card title="Total" value={totalInvoices} type="total" />
      <Card title="Efectivo" value={totalCashInvoices} type="cash" />
      <Card title="Pago Móvil" value={totalPmInvoices} type="pm" />
      <Card title="Punto de Venta" value={totalPosInvoices} type="pos" />
      <Card title="Canceladas" value={cancelled} type="cancelled" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'total' | 'cash' | 'pm' | 'pos' | 'cancelled';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
