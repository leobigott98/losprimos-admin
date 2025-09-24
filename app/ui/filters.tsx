"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { useSearchParams, useRouter } from 'next/navigation';
import clsx from "clsx";

type FilterField =
  | { type: "select"; name: string; label: string; options: string[] }
  | { type: "dateRange"; name: string; label: string }
  | { type: "slider"; name: string; label: string; min: number; max: number };

interface FilterDropdownProps {
  title?: string;
  fields: FilterField[];
}

export function FilterDropdown({
  title = "Filtrar",
  fields,
}: FilterDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = React.useState<Record<string, any>>({});

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setValues({});
    const params = new URLSearchParams(searchParams.toString());
    fields.forEach((field) => {
      if (field.type === "dateRange") {
        params.delete(`${field.name}From`);
        params.delete(`${field.name}To`);
      } else {
        params.delete(field.name);
      }
    });
    router.push(`?${params.toString()}`);
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    Object.entries(values).forEach(([key, value]) => {
      if (value === "" || value == null) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`?${params.toString()}`);
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className={clsx("flex h-10 items-center rounded-lg px-4 text-sm transition-colors hover:bg-gray-100 border border-gray-200", 
          searchParams.has('category') || searchParams.has('status') ? 'bg-gray-100' : ''
        )}>
          <span className="hidden md:block text-gray-500">{title}</span>{" "}
          <FunnelIcon className={clsx("h-5 md:ml-3 text-gray-500", searchParams.has('category') || searchParams.has('status') ? 'fill-gray-500' : 'fill-none')} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          className="w-80 rounded-lg bg-gray-100 p-4 shadow-lg"
        >
          <div className="space-y-4">
            {fields.map((field) => {
              if (field.type === "select") {
                return (
                  <div key={field.name} className="flex flex-col">
                    <label className="text-sm font-medium mb-1">
                      {field.label}
                    </label>
                    <select
                      className="border rounded p-2"
                      value={
                        values[field.name] ?? searchParams.get(field.name) ?? ""
                      }
                      onChange={(e) => handleChange(field.name, e.target.value)}
                    >
                      <option value="">Todos</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field.type === "dateRange") {
                return (
                  <div key={field.name} className="flex flex-col">
                    <label className="text-sm font-medium mb-1">
                      {field.label}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        className="border rounded p-2 flex-1"
                        value={
                          values[`${field.name}From`] ??
                          searchParams.get(`${field.name}From`) ??
                          ""
                        }
                        onChange={(e) =>
                          handleChange(`${field.name}From`, e.target.value)
                        }
                      />
                      <input
                        type="date"
                        className="border rounded p-2 flex-1"
                        value={
                          values[`${field.name}To`] ??
                          searchParams.get(`${field.name}To`) ??
                          ""
                        }
                        onChange={(e) =>
                          handleChange(`${field.name}To`, e.target.value)
                        }
                      />
                    </div>
                  </div>
                );
              }

              if (field.type === "slider") {
                return (
                  <div key={field.name} className="flex flex-col">
                    <label className="text-sm font-medium mb-1">
                      {field.label}: {values[field.name] ?? field.max}
                    </label>
                    <input
                      type="range"
                      min={field.min}
                      max={field.max}
                      value={
                        values[field.name] ??
                        Number(searchParams.get(field.name)) ??
                        field.max
                      }
                      onChange={(e) =>
                        handleChange(field.name, Number(e.target.value))
                      }
                    />
                  </div>
                );
              }

              return null;
            })}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={handleClear}
              className="px-3 py-1 text-sm border rounded bg-white hover:bg-gray-200"
            >
              Borrar
            </button>

            <button
              onClick={handleApply}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Aplicar
            </button>
          </div>
          <Popover.Arrow className="fill-gray-100" width={16} height={8} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/* "use client";

import { FunnelIcon } from "@heroicons/react/24/outline";
import { MouseEventHandler, useState } from "react";

export default function Filters() {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={()=>{setOpen(!open)}}
      className="flex h-10 items-center rounded-lg px-4 text-sm transition-colors hover:bg-gray-100 border border-gray-200"
    >
      <span className="hidden md:block text-gray-500">Filtrar</span>{" "}
      <FunnelIcon className="h-5 md:ml-4 text-gray-500" />
    </button>
  );
} */
