export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { Users, Mail, Phone, MapPin, ShoppingBag } from "lucide-react";

export default async function CustomersAdminPage() {
  let customers: any[] = [];
  try {
    customers = await prisma.storeCustomer.findMany({
      include: {
        addresses: true,
        orders: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err: any) {
    console.warn("Notice: Store customers database query deferred:", err.message);
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0A192F]">Store Customers</h1>
        <p className="text-xs text-slate-500 mt-1">
          Registered buyers, customer spending profiles, and shipping address records.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
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
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    No store customers registered yet.
                  </td>
                </tr>
              ) : (
                customers.map((c: any) => {
                  const totalSpent = (c.orders || []).reduce((acc: number, o: any) => acc + (o.total || 0), 0);
                  const defAddr = c.addresses?.[0];

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <strong className="text-slate-900 block">{c.name}</strong>
                        <span className="text-[10px] text-slate-400">{c.email}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {c.phone || "—"}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {c.orders?.length || 0} order(s)
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-[#0A192F]">
                        ₹{totalSpent.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                        {defAddr
                          ? `${defAddr.addressLine1}, ${defAddr.city}, ${defAddr.state} - ${defAddr.postalCode}`
                          : "No address recorded"}
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
