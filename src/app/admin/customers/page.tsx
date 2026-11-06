import prisma from "@/lib/prisma";
import { Users, Mail, Phone, MapPin, ShoppingBag } from "lucide-react";

export default async function CustomersAdminPage() {
  const customers = await prisma.storeCustomer.findMany({
    include: {
      addresses: true,
      orders: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0A192F]">Store Customers</h1>
        <p className="text-xs text-slate-500 mt-1">
          Registered buyers, customer spending profiles, and shipping address records.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Total Spent</th>
                <th className="py-3.5 px-4">Default Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">No store customers found.</td>
                </tr>
              ) : (
                customers.map((c) => {
                  const totalSpent = c.orders.reduce((acc, o) => acc + o.total, 0);
                  const defAddr = c.addresses?.[0];

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4">
                        <strong className="text-slate-900 block">{c.name}</strong>
                        <span className="text-[10px] text-slate-400">{c.email}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{c.phone || "—"}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{c.orders.length} order(s)</td>
                      <td className="py-3.5 px-4 font-extrabold text-[#2563EB]">
                        ₹{totalSpent.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                        {defAddr ? `${defAddr.addressLine1}, ${defAddr.city}, ${defAddr.postalCode}` : "None"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
