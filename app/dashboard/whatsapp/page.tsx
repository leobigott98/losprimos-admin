import { Suspense } from "react";
import { Card, CardSkeleton } from "@/app/ui/qr-code/cards";

import { lusitana } from "@/app/ui/fonts";

export default function Page() {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Código QR Whatsapp
      </h1>
      <Suspense fallback={<CardSkeleton />}>
        <Card title="Escanear para iniciar sesión en WhatsApp">
          <iframe src={process.env.QR_CODE_URL} width={'100%'} height={460}></iframe>
        </Card>
      </Suspense>
    </div>
  );
}
