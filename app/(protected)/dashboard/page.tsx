import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { TopItemsChart } from "@/components/dashboard/top-items-chart";
import { TrendingUp, ShoppingBag, Table2, AlertTriangle } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

  const [
    { data: todayOrders },
    { data: yesterdayOrders },
    { data: tables },
    { data: inventory },
    { data: topItems },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from("orders").select("*").gte("created_at", `${today}T00:00:00`),
    supabase.from("orders").select("*").gte("created_at", `${yesterday}T00:00:00`).lt("created_at", `${today}T00:00:00`),
    supabase.from("tables").select("*"),
    supabase.from("inventory").select("*"),
    supabase.from("top_selling_items").select("*").limit(6),
    supabase.from("orders").select("*, tables(table_number)").order("created_at", { ascending: false }).limit(8),
  ]);

  const revenue = todayOrders?.reduce((s, o) => s + Number(o.total_amount), 0) ?? 0;
  const yRevenue = yesterdayOrders?.reduce((s, o) => s + Number(o.total_amount), 0) ?? 0;
  const revDiff = yRevenue > 0 ? ((revenue - yRevenue) / yRevenue) * 100 : 0;

  const availableTables = tables?.filter((t) => t.status === "available").length ?? 0;
  const occupiedTables  = tables?.filter((t) => t.status === "occupied").length ?? 0;
  const lowStock        = inventory?.filter((i) => i.quantity <= i.minimum_stock).length ?? 0;
  const chartData       = topItems?.map((item) => ({ name: item.name, sales: Number(item.total_quantity) })) ?? [];

  const statusColors: Record<string, string> = {
    pending:   "badge-pending",
    preparing: "badge-preparing",
    ready:     "badge-ready",
    served:    "badge-served",
    completed: "badge-completed",
    cancelled: "badge-cancelled",
  };

  return (
    <div className="grid gap-6">
      {/* Page header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Analytics</p>
        <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">Dashboard</h1>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Metrics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Today's Revenue"
          value={formatCurrency(revenue)}
          icon={TrendingUp}
          iconColor="text-[hsl(var(--primary))]"
          iconBg="bg-[hsl(var(--primary)/0.1)]"
          trend={revDiff !== 0 ? { value: revDiff, label: "vs yesterday" } : undefined}
        />
        <MetricCard
          title="Orders Today"
          value={todayOrders?.length ?? 0}
          icon={ShoppingBag}
          iconColor="text-[hsl(var(--accent))]"
          iconBg="bg-[hsl(var(--accent)/0.1)]"
          sub={`${todayOrders?.filter((o) => o.status === "pending").length ?? 0} pending`}
        />
        <MetricCard
          title="Available Tables"
          value={availableTables}
          icon={Table2}
          iconColor="text-[hsl(var(--success))]"
          iconBg="bg-[hsl(var(--success)/0.1)]"
          sub={`${occupiedTables} occupied`}
        />
        <MetricCard
          title="Inventory Alerts"
          value={lowStock}
          icon={AlertTriangle}
          iconColor={lowStock > 0 ? "text-[hsl(var(--warning))]" : "text-[hsl(var(--success))]"}
          iconBg={lowStock > 0 ? "bg-[hsl(var(--warning)/0.1)]" : "bg-[hsl(var(--success)/0.1)]"}
          sub={lowStock > 0 ? "items below threshold" : "All stocked"}
        />
      </section>

      {/* Chart + Recent Orders */}
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Ranked by total quantity sold</p>
          </CardHeader>
          <CardContent className="h-72">
            <TopItemsChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul>
              {(recentOrders ?? []).map((order, i) => (
                <li key={order.id} className={`flex items-center justify-between px-5 py-3 text-sm ${i !== 0 ? "border-t border-[hsl(var(--border))]" : ""}`}>
                  <div>
                    <p className="font-semibold">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Table {(order.tables as { table_number: number } | null)?.table_number ?? "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{formatCurrency(order.total_amount)}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${statusColors[order.status] ?? ""}`}>
                      {order.status}
                    </span>
                  </div>
                </li>
              ))}
              {!recentOrders?.length && (
                <li className="px-5 py-8 text-center text-sm text-[hsl(var(--muted-foreground))]">No orders yet today.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  title, value, icon: Icon, iconColor, iconBg, trend, sub,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  trend?: { value: number; label: string };
  sub?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">{title}</p>
            <p className="mt-1 text-3xl font-black tracking-tight">{value}</p>
            {trend && (
              <p className={`mt-1 text-xs font-semibold ${trend.value >= 0 ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]"}`}>
                {trend.value >= 0 ? "▲" : "▼"} {Math.abs(trend.value).toFixed(1)}% {trend.label}
              </p>
            )}
            {sub && !trend && <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{sub}</p>}
          </div>
          <div className={`flex size-11 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon className={`size-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
