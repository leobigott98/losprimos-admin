"use client";

import { Zonas } from "@/app/lib/definitions";
import { toggleDeliveryZoneStatus } from "@/app/lib/actions";
import { useTransition } from "react";

export default function StatusButton({ zone }: { zone: Zonas }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await toggleDeliveryZoneStatus(
        zone.zona_id,
        zone.status_valor
      );
    });
  };

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleClick}
      className={`rounded-full px-3 py-1 text-sm font-medium transition ${
        isPending
          ? "bg-gray-200 text-gray-800"
          : zone.status_valor == 1
          ? "bg-green-200 text-green-800 hover:bg-green-300"
          : "bg-red-200 text-red-800 hover:bg-red-300"
      }`}
    >
      {isPending? "Procesando... " : zone.status_valor == 1 ? "Disponible" : "Suspendido"}
    </button>
  );
}