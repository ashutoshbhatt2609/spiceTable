import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, AlertTriangle, Star } from "lucide-react";

export default async function ReportsPage() {
  const supabase = await createClient();
  const [{ data: sales }, { data: lowStock }, { data: topItems }] = await Promise.all([
    supabase.from("sales_report").select("*"),
    supabase.from("low_stock_items").select("*"),
    supabase.from("top_selling_items").select("*"),
  ]);

  const totalRevenue = (sales ?? []).reduce((s, r) => s + Number(r.revenue), 0);
  const totalOrders  = (sales ?? []).reduce((s, r) => s + Number(r.orders), 0);

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary))]">Analytics</p>
        <h1 className="text-3xl font-black tracking-tight">Reports</h1>
      </div>

      {/* Summary metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Total Revenue (All Time)</p>
            <p className="text-2xl font-black mt-1">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Total Orders</p>
            <p className="text-2xl font-black mt-1">{totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Avg. Order Value</p>
            <p className="text-2xl font-black mt-1">{formatCurrency(totalOrders ? totalRevenue / totalOrders : 0)}</p>
          </CardContent>
        </Card>
      </div>

      <section className="grid gap-5 lg:grid-cols-3">
        {/* Sales Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-[hsl(var(--primary))]" />
              Daily Sales
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {(sales ?? []).length === 0 ? (
              <p className="px-5 pb-5 text-sm text-[hsl(var(--muted-foreground))]">No sales data yet.</p>
            ) : (
              <ul>
                {(sales ?? []).map((r, i) => (
                  <li key={r.day} className={`flex items-center justify-between px-5 py-3 text-sm ${i !== 0 ? "border-t border-[hsl(var(--border))]" : ""}`}>
                    <div>
                      <p className="font-semibold">{r.day}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{r.orders} orders</p>
                    </div>
                    <p className="font-bold text-[hsl(var(--primary))]">{formatCurrency(r.revenue)}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className={`size-5 ${(lowStock ?? []).length > 0 ? "text-[hsl(var(--warning))]" : "text-[hsl(var(--success))]"}`} />
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {(lowStock ?? []).length === 0 ? (
              <p className="px-5 pb-5 text-sm text-[hsl(var(--success))]">✓ All items are well stocked.</p>
            ) : (
              <ul>
                {(lowStock ?? []).map((r, i) => (
                  <li key={r.id} className={`flex items-center justify-between px-5 py-3 text-sm ${i !== 0 ? "border-t border-[hsl(var(--border))]" : ""}`}>
                    <p className="font-semibold">{r.item_name}</p>
                    <span className="badge-cancelled rounded-full px-2.5 py-0.5 text-xs font-bold">
                      {r.quantity} {r.unit}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Top Sellers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="size-5 text-[hsl(var(--warning))]" />
              Top Selling Items
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {(topItems ?? []).length === 0 ? (
              <p className="px-5 pb-5 text-sm text-[hsl(var(--muted-foreground))]">No sales data yet.</p>
            ) : (
              <ul>
                {(topItems ?? []).map((r, i) => (
                  <li key={r.name} className={`flex items-center justify-between px-5 py-3 text-sm ${i !== 0 ? "border-t border-[hsl(var(--border))]" : ""}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-[hsl(var(--muted-foreground))]">#{i + 1}</span>
                      <p className="font-semibold">{r.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xs">{r.total_quantity} sold</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{formatCurrency(r.revenue)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
