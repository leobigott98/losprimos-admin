import Link from 'next/link';
import {
  TagIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createFilling } from '@/app/lib/actions';

export default function Form() {
  return (
    <form action={createFilling}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="sabor_categoria" className="mb-2 block text-sm font-medium">
            Elige una categoría
          </label>
          <div className="relative">
            <select
              id="sabor_categoria"
              name="sabor_categoria"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
            >
              <option value="" disabled>
                Elige una categoría
              </option>
              <option key='normal' value='normal'>
                normal
              </option>
              <option key='mar' value='mar'>
                mar
              </option>
            </select>
            <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="sabor_nombre" className="mb-2 block text-sm font-medium">
            Indica el nombre
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="sabor_nombre"
                name="sabor_nombre"
                type="text"
                placeholder="Nombre del Sabor"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Agregar Sabor</Button>
      </div>
    </form>
  );
}
