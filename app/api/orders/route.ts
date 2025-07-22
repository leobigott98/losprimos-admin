import { type NextRequest } from "next/server";
import { fetchFilteredOrders } from "@/app/lib/data";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams?.get('query') || '';
    const page = Number(searchParams?.get('page')) || 1;
    const data = await fetchFilteredOrders(query, page);

    return Response.json(data);
}