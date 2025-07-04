"use client";

import { lusitana } from "@/app/ui/fonts";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@/app/ui/button";
import { useActionState, useEffect, useState } from "react";
import { registerUser } from "@/app/lib/actions";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const router = useRouter();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, formAction, isPending] = useActionState(
    async (prevState: string | undefined, formData: FormData) => {
      setHasSubmitted(true); // ✅ Mark as submitted
      return await registerUser(prevState, formData);
    },
    undefined
  );

  // Redirect to login after successful registration
  useEffect(() => {
    if (hasSubmitted && !errorMessage && isPending === false ) {
      setShowSuccess(true);
      setTimeout(()=>{
        router.push("/auth/sign-in");
      }, 1000, )
      
    }
  }, [errorMessage, isPending, router]);

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Registro de Usuario.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="nombre"
            >
              Nombre
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="nombre"
                type="text"
                name="nombre"
                placeholder="Nombre"
                required
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="apellido"
            >
              Apellido
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="apellido"
                type="text"
                name="apellido"
                placeholder="Apellido"
                required
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Contraseña"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <Button className="mt-4 w-full" aria-disabled={isPending}>
          Registrarse{" "}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <Button
          type="button"
          onClick={() => router.push("/auth/sign-in")}
          className="mt-4 w-full rounded-md px-4 py-2 text-gray-700 bg-gray-300 hover:bg-gray-200 transition mx-auto active:bg-gray-600"
        >
          Cancelar
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
          {showSuccess && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-600">¡Registro exitoso! Redirigiendo al inicio de sesión...</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
