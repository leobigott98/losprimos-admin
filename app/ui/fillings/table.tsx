import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredFillings } from '@/app/lib/data';

export default async function FillingsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const fillings = await fetchFilteredFillings(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {fillings?.map((filling) => (
              <div
                key={filling.sabor_id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{filling.sabor_nombre}</p>
                    </div>
                    <p className="text-sm text-gray-500">{filling.sabor_categoria}</p>
                  </div>
                  {/* <InvoiceStatus status={filling.sabor_disponible} /> */}
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatDateToLocal(filling.creado)}
                    </p>
                    <p>{filling.actualizado !== null ? formatDateToLocal(filling.actualizado) : '-'}</p>
                  </div>
                  <div className="flex justify-end gap-2">

                    {/* <UpdateInvoice id={invoice.id} />
                    <DeleteInvoice id={invoice.id} /> */}

                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Nombre
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Categoría
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Fecha Creación
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Fecha Actualización
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Estatus
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Editar</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {fillings?.map((filling) => (
                <tr
                  key={filling.sabor_id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{filling.sabor_nombre}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {filling.sabor_categoria}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(filling.creado)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {filling.actualizado !== null ? formatDateToLocal(filling.actualizado) : '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {/* <InvoiceStatus status={invoice.status} /> */}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">

                      {/* <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} /> */}

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
