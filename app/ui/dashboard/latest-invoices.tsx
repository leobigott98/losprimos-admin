import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import { lusitana } from "@/app/ui/fonts";
import { LatestInvoice } from "@/app/lib/definitions";
import { fetchLatestInvoices } from "@/app/lib/data";
import Link from "next/link";

export default async function LatestInvoices() {
  const latestInvoices = await fetchLatestInvoices();

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Últimas Órdenes
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        {/* NOTE: Uncomment this code in Chapter 7 */}

        <div className="bg-white rounded-lg overflow-hidden">
          {latestInvoices.map((invoice, i) => {
            return (
              <Link key={invoice.id} href={`/dashboard/invoices/${invoice.id}`}>
                <div className="hover:bg-gray-50 transition-colors duration-150">
                  <div className="px-6">
                    <div
                      className={clsx(
                        "flex flex-row items-center justify-between py-4",
                        {
                          "border-b": i !== latestInvoices.length - 1,
                        }
                      )}
                    >
                      <div className="flex items-center">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold md:text-base">
                            {invoice.name}
                          </p>
                          <p className="hidden text-sm text-gray-500 sm:block">
                            {invoice.phone}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                      >
                        {invoice.amount}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">
            Actualizado justo ahora
          </h3>
        </div>
      </div>
    </div>
  );
}
