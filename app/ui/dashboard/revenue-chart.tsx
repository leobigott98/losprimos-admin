export const dynamic = 'force-dynamic';

import { generateYAxis, formatHourLabel } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue } from '@/app/lib/data';
import { Revenue } from '@/app/lib/definitions';

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

const ordersByHour: Revenue[] = [
  {orders: 0, hour: '12 AM'},
  {orders: 0, hour: '01 AM'},
  {orders: 0, hour: '02 AM'},
  {orders: 0, hour: '03 AM'},
  {orders: 0, hour: '04 AM'},
  {orders: 0, hour: '05 AM'},
  {orders: 0, hour: '06 AM'},
  {orders: 0, hour: '07 AM'},
  {orders: 0, hour: '08 AM'},
  {orders: 0, hour: '09 AM'},
  {orders: 0, hour: '10 AM'},
  {orders: 0, hour: '11 AM'},
  {orders: 0, hour: '12 PM'},
  {orders: 0, hour: '01 PM'},
  {orders: 0, hour: '02 PM'},
  {orders: 0, hour: '03 PM'},
  {orders: 0, hour: '04 PM'},
  {orders: 0, hour: '05 PM'},
  {orders: 0, hour: '06 PM'},
  {orders: 0, hour: '07 PM'},
  {orders: 0, hour: '08 PM'},
  {orders: 0, hour: '09 PM'},
  {orders: 0, hour: '10 PM'},
  {orders: 0, hour: '11 PM'},
]

export default async function RevenueChart() {
  const revenue = await fetchRevenue();

  const chartHeight = 350;
  // NOTE: Uncomment this code in Chapter 7

   if (!revenue || revenue.length === 0) {
     return <p className="mt-4 text-gray-400">Sin data disponible.</p>;
   }

   const updatedOrders: Revenue[] = ordersByHour.map(({ hour }) => {
  const match = revenue.find((r) => r.hour === hour);
  return {
    hour,
    orders: match?.orders || 0
  };
}).map((entry, index, array) => {
  if (index < array.length - 1) {
    const combinedOrders = entry.orders + array[index + 1].orders;
    return {
      hour: entry.hour,
      orders: combinedOrders,
    };
  }
  return entry;
}).filter(({ hour }) => {
  // Convert to 24-hour number
  const [hStr, period] = hour.split(' ');
  let hNum = parseInt(hStr);
  if (period === 'AM') {
    if (hNum === 12) hNum = 0;
  } else {
    if (hNum !== 12) hNum += 12;
  }
  return hNum % 2 === 0;
}).map(({ orders }, index) => {
  // Final formatting (optional — if you want guaranteed format consistency)
  const hour24 = index * 2; // even hours: 0, 2, 4, ...
  return {
    hour: formatHourLabel(hour24),
    orders
  };
});

const { yAxisLabels, topLabel } = generateYAxis(updatedOrders);

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Órdenes Recientes
      </h2>
      {/* NOTE: Uncomment this code in Chapter 7 */}

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight * 1.1}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {updatedOrders.map((hour) => (
            <div key={hour.hour} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: `${(chartHeight / topLabel) * hour.orders}px`,
                }}
              ></div>
              <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                {hour.hour}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Últimos 30 días</h3>
        </div>
      </div>
    </div>
  );
}
