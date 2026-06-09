"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import type { OrderStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock, ChefHat } from "lucide-react";

type KitchenOrder = {
  id: string;
  status: OrderStatus;
  created_at: string;
  tables?: { table_number: number } | null;
  order_items?: { quantity: number; menu_items?: { name: string } | null }[];
};

const statusConfig: Record<string, { cls: string }> = {
  pending:   { cls: "badge-pending"   },
  preparing: { cls: "badge-preparing" },
  ready:     { cls: "badge-ready"     },
};

export function KitchenBoard({ initialOrders }: { initialOrders: KitchenOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const supabase = createClient();

  // BUG FIX: stable refresh via useCallback
  const refresh = useCallback(async () => {
    const { data } = await supabase
      .from("orders")
      .select("*, tables(*), order_items(*, menu_items(*))")
      .in("status", ["pending", "preparing", "ready"])
      .order("created_at");
    setOrders(data ?? []);
  }, [supabase]);

  useEffect(() => {
    const channel = supabase
      .channel("kitchen-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, refresh)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase, refresh]);

  async function update(id: string, status: OrderStatus) {
    await supabase.from("orders").update({ status }).eq("id", id);
    await refresh();
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary))]">Realtime</p>
        <h1 className="text-3xl font-black tracking-tight">Kitchen Display</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          {orders.length} order{orders.length !== 1 ? "s" : ""} in queue · Auto-refreshes via realtime
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[hsl(var(--border))] py-24 text-center">
          <ChefHat className="size-12 mb-3 text-[hsl(var(--muted-foreground))]" />
          <p className="font-semibold">Kitchen is clear!</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">No pending orders right now.</p>
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <Card key={order.id} className={cn(order.status === "pending" && "border-[hsl(var(--warning)/0.5)] animate-pulse-ring")}>
              <CardContent className="grid gap-4 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black text-lg">Table {order.tables?.table_number ?? "—"}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1 mt-0.5">
                      <Clock className="size-3" />
                      {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <span className={cn("rounded-full px-3 py-1 text-xs font-bold capitalize", statusConfig[order.status]?.cls ?? "")}>
                    {order.status}
                  </span>
                </div>

                <ul className="grid gap-1.5">
                  {order.order_items?.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="flex size-5 items-center justify-center rounded bg-[hsl(var(--primary)/0.15)] text-xs font-bold text-[hsl(var(--primary))]">
                        {item.quantity}
                      </span>
                      <span>{item.menu_items?.name ?? "Unknown item"}</span>
                    </li>
                  ))}
                </ul>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={order.status === "preparing" ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => update(order.id, "preparing")}
                    disabled={order.status === "preparing"}
                  >
                    Start Preparing
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => update(order.id, "ready")}
                    disabled={order.status === "ready"}
                  >
                    Mark Ready ✓
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
