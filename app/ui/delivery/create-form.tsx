'use client'

import Link from 'next/link';
import {
  BanknotesIcon,
  PencilIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createDeliveryZone } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function Form() {
  const [message, formAction, isPending] = useActionState(
      createDeliveryZone,
      undefined,
    );

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Delivery Zone Name */}
        <div className="mb-4">
          <label htmlFor="zona_nombre" className="mb-2 block text-sm font-medium">
            Indica el nombre
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="zona_nombre"
                name="zona_nombre"
                type="text"
                placeholder="Nombre de la zona"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Delivery Zone Name */}
        <div className="mb-4">
          <label htmlFor="zona_precio" className="mb-2 block text-sm font-medium">
            Indica el precio
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="zona_precio"
                name="zona_precio"
                type="text"
                placeholder="Precio del delivery a la zona"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {message && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-green-500" />
              <p className="text-sm text-green-500">{message}</p>
            </>
          )}
      </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/delivery"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Agregar Zona</Button>
      </div>
    </form>
  );
}
