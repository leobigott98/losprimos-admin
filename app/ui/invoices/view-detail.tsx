'use client';

import { CustomerField, InvoiceForm, OrdenesTable } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  PhoneIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

export default function EditInvoiceForm({
  order
}: {
  order: OrdenesTable;
}) {
  //const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);

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
              {/* <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
            </div>
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Estatus de la orden
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  defaultChecked={order.status === 'pending'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pendiente <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  defaultChecked={order.status === 'pagado'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Pagado <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      {/* </div> */}
      {/* Commented for later use */}
      {/* <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Editar Orden</Button>
      </div> */}
    
    </div>
  );
}
