"use client";

import { Sabores } from "@/app/lib/definitions";
import { toggleFillingAvailability } from "@/app/lib/actions";
import { useState, useTransition } from "react";

export default function AvailableButton({ filling }: { filling: Sabores }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await toggleFillingAvailability(
        filling.sabor_id,
        filling.sabor_disponible
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
          : filling.sabor_disponible
          ? "bg-green-200 text-green-800 hover:bg-green-300"
          : "bg-red-200 text-red-800 hover:bg-red-300"
      }`}
    >
      {isPending? "Procesando... " : filling.sabor_disponible ? "Disponible" : "Agotado"}
    </button>
  );
}
