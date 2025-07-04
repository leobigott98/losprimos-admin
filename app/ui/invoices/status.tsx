import { CheckIcon, ClockIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function InvoiceStatus({ status }: { status: string | null }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100 text-gray-500': status === '' || status == null || !status || status === 'pending',
          'bg-yellow-500 text-white': status === 'Orden facturada',
          'bg-orange-400 text-black': status === 'Orden recibida',
          'bg-green-400 text-black': status === 'Orden despachada'
        },
      )}
    >
      {status === '' || status == null || !status || status === 'pending' ? (
        <>
          Pendiente
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {status === 'Orden facturada' ? (
        <>
          Facturada
          <BanknotesIcon className="ml-1 w-4 text-black" />
        </>
      ) : null}
      {status === 'Orden recibida' ? (
        <>
          Recibida
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === 'Orden despachada' ? (
        <>
          Despachada
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
