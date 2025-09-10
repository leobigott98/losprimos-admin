import { OrdenesTable } from '@/app/lib/definitions';
import {
  CurrencyDollarIcon,
  UserCircleIcon,
  PhoneIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import StatusCombo from './status-combo';
import Image from 'next/image';

export default function Form({
  order
}: {
  order: OrdenesTable;
}) {

  return (
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <h2 className="mb-2 block text-sm font-medium">
            Cliente
          </h2>
          <div className="relative">
            <p className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2">
                {order.name}
            </p>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Customer Phone */}
        <div className="mb-4">
          <h2 className="mb-2 block text-sm font-medium">
            Teléfono
          </h2>
          <div className="relative">
            <p className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2">
                {order.phone}
            </p>
            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Order Amount */}
        <div className="mb-4">
          <h2 className="mb-2 block text-sm font-medium">
            Monto
          </h2>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <p className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
                {formatCurrency(order.amount)}
              </p>
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Order Date */}
        <div className="mb-4">
          <h2 className="mb-2 block text-sm font-medium">
            Fecha
          </h2>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <p className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
                {formatDateToLocal(order.created_at)}
              </p>
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Order Detail Amount */}
        <div className="mb-4">
          <h2 className="mb-2 block text-sm font-medium">
            Detalle
          </h2>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
                {order.detail.split('\n').filter((item, index)=>{
                    if(item.trim() === '') return false;
                    if(index === order.detail.split('\n').length -1) return false;
                    return true;
                }).map((item)=>(
                        <p key={item} className="peer block w-full rounded-md border border-gray-200 py-2 pl-5 text-sm outline-2 placeholder:text-gray-500">
                            {item}
                        </p>
                    )   
                )}
              </div>
          </div>
        </div>

        {/* Payment Info */}
        { order.payment === 'Pago Movil' || 'Efectivo'? (
        <div className="mb-4">
          <h2 className="mb-2 block text-sm font-medium">
            Detalle de Pago
          </h2>
          <div className="relative mt-2 rounded-md">
                <Image alt={`Comprobante de Pago Orden ${order.order_num}`} src={`${process.env.PAYMENT_IMG_URL}/${order.image}`} width={300} height={600} className='mx-auto rounded-md'/>
          </div>
        </div>) : <></>
        }
        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Estatus de la orden
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <StatusCombo status={order.status_valor} orderNum={order.order_num}/>
          </div>
        </fieldset>    
    </div>
  );
}
