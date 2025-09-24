import Pagination from "@/app/ui/pagination";
import Search from "@/app/ui/search";
import { AddFilling } from "@/app/ui/fillings/buttons";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchFillingsPages } from "@/app/lib/data";
import FillingsTable from "@/app/ui/fillings/table";
import { FilterDropdown } from "@/app/ui/filters";

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
  const category = searchParams?.category || "";
  const status = searchParams?.status || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchFillingsPages(query, category, status);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Sabores</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <FilterDropdown
          /* title="Menu Filters" */
          fields={[
            /* {
              type: "select",
              name: "restaurant",
              label: "Restaurant",
              options: ["A", "B", "C"],
            }, */
            {
              type: "select",
              name: "status",
              label: "Estatus",
              options: ["Disponible", "Agotado"],
            },
            {
              type: "select",
              name: "category",
              label: "Categoría",
              options: ["Mar", "Normal", "Refresco", "Lipton"],
            },
            /* { type: "dateRange", name: "date", label: "Date Range" },
            {
              type: "slider",
              name: "price",
              label: "Price ≤",
              min: 0,
              max: 100,
            }, */
          ]}
        />
        <Search placeholder="Buscar sabores..." />
        <AddFilling />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <FillingsTable query={query} currentPage={currentPage} status={status} category={category}/>
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
