import { CheckIcon, ClockIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function InvoiceStatus({ status }: { status: string | null }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100 text-gray-500': status === '' || status == null || !status || status === 'pending',
          'bg-green-500 text-white': status === 'pagado',
          'bg-yellow-400 text-black': status === 'Pago Efectivo'
        },
      )}
    >
      {status === '' || status == null || !status || status === 'pending' ? (
        <>
          Pendiente
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {status === 'Pago Efectivo' ? (
        <>
          Pago en Efectivo
          <BanknotesIcon className="ml-1 w-4 text-black" />
        </>
      ) : null}
      {status === 'pagado' ? (
        <>
          Pagado
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
