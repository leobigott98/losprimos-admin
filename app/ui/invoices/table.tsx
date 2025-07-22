'use client';

import { useEffect, useState } from 'react';
import useSWR, { Fetcher, mutate } from 'swr';
import { ViewDetail } from '@/app/ui/invoices/buttons';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import StatusCombo from './status-combo';
import { OrdenesTable } from '@/app/lib/definitions';
import axios from 'axios';

const fetcher: Fetcher<OrdenesTable[], string> = (url: string) => axios.get(url).then(res => res.data);

export default function Table({ query, currentPage }: { query: string; currentPage: number; }) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { data: orders, error, isLoading } =  useSWR<OrdenesTable[]>(`/api/orders?query=${query}&page=${currentPage}`, fetcher);

  useEffect(()=>{
    setAudio(new Audio('/new-notification-011-364050.mp3'));
  }, [setAudio])

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'newOrder') {
        mutate(`/api/orders?query=${query}&page=${currentPage}`);
        if (audio){
          console.log(audio);
          audio.play();
        }
      }
    };

    return () => ws.close();
  }, [query, currentPage]);

  if (error) return <div>Failed to load data</div>
  if (isLoading) return <div>Loading...</div>;
  if(orders) console.log(orders);

  return (
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              {orders?.map((order) => (
                <div
                  key={order.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <p>{order.name}</p>
                      </div>
                      <p className="text-sm text-gray-500">{order.phone}</p>
                    </div>
                    <StatusCombo status={order.status_valor} orderNum={order.order_num}/>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <div className='flex justify-between'>
                        <p className="text-xl font-medium">
                        {order.order_num}
                        </p>
                        <p className='text-sm font-normal'>
                          {formatCurrency(order.amount)}
                        </p>
                      </div>
                      <p>{formatDateToLocal(order.created_at)}</p>
                    </div>
                    <div className="flex justify-end gap-2">
                      {/* Commented for later use */}
                      {/* <UpdateInvoice id={order.id} />
                      <DeleteInvoice id={order.id} /> */}
                      <ViewDetail id={order.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    No. Orden
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Cliente
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Teléfono
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Monto
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Fecha
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Pago
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
                {orders?.map((order) => (
                  <tr
                    key={order.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <p>{order.order_num}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <p>{order.name}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {order.phone}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatDateToLocal(order.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {order.payment?? 'pendiente'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <StatusCombo status={order.status_valor} orderNum={order.order_num}/>
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <ViewDetail id={order.id} />
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

