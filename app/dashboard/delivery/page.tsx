import Pagination from "@/app/ui/pagination";
import Search from "@/app/ui/search";
import { AddDeliveryZone } from "@/app/ui/fillings/buttons";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchDeliveryZonesPages } from "@/app/lib/data";
import ZonesTable from "@/app/ui/delivery/table";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    restaurant?: string;
    status?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    price?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchDeliveryZonesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Zonas de Delivery</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar zona..." />
        <AddDeliveryZone />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <ZonesTable query={query} currentPage={currentPage}/>
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}