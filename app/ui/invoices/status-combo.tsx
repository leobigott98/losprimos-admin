'use client';

import  { updateOrderStatus } from "@/app/lib/actions"
import { useState, useTransition } from 'react';

interface Status {
  label: string,
  value: number
}

const statusValues: Status[] = [
  {
    label: 'Orden Recibida',
    value: 4
  }, 
  {
    label: 'Orden Facturada',
    value: 5
  }, 
  {
    label: 'Orden Despachada',
    value: 6
  }, 

]

export default function StatusCombo({status, orderNum}: {status: number, orderNum: number}) {
  const [isPending, startTransition] = useTransition();
  const [newStatus, setNewStatus] = useState<Status>({value: 0, label: ''})

    return(
      <form action={updateOrderStatus}>
        <input 
          id="orderNum"
          name="orderNum"
          defaultValue={orderNum}
          hidden
          />
        <select
              id="statusId"
              name="statusId"
              className={`peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 ${
                isPending?? `bg-gray-400 text-gray-800`
              }`}
              disabled={isPending}
              onChange={(event)=> startTransition( async() => {
                setNewStatus({value: Number(event.target.value), label: statusValues[Number(event.target.value) - 4].label})
                event.target.form?.requestSubmit()})}
            >
              <option key={newStatus.label != ''? newStatus.value : statusValues[status - 4].value} value={newStatus.label != ''? newStatus.value :statusValues[status - 4].value}>
                {newStatus.label != ''? newStatus.label : statusValues[status - 4].label}
              </option>
              {
                statusValues.filter((statusValue)=> statusValue.value !== status).map((statusValue) => (
                  <option key={statusValue.value} value={statusValue.value}>
                    {isPending? 'Procesando' : statusValue.label}
                  </option>
                ))
              }
            </select>
            </form>
    )
}