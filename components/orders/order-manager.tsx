"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MenuItem, Order, OrderStatus, RestaurantTable } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { Plus, Minus, ShoppingCart, Trash2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

type Customer = { id: string; name: string };
type CartLine = { item: MenuItem; quantity: number };

const statusConfig: Record<OrderStatus, { label: string; cls: string }> = {
  pending:   { label: "Pending",   cls: "badge-pending"   },
  preparing: { label: "Preparing", cls: "badge-preparing" },
  ready:     { label: "Ready",     cls: "badge-ready"     },
  served:    { label: "Served",    cls: "badge-served"    },
  completed: { label: "Completed", cls: "badge-completed" },
  cancelled: { label: "Cancelled", cls: "badge-cancelled" },
};

export function OrderManager({
  initialOrders, tables, menuItems, customers,
}: {
  initialOrders: Order[];
  tables: RestaurantTable[];
  menuItems: MenuItem[];
  customers: Customer[];
}) {
  const [orders, setOrders]   = useState(initialOrders);
  const [cart, setCart]       = useState<Record<string, CartLine>>({});
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const total = useMemo(
    () => Object.values(cart).reduce((s, l) => s + Number(l.item.price) * l.quantity, 0),
    [cart],
  );

  // ── BUG FIX: stable callback so useEffect dependency is correct ──
  const refresh = useCallback(async () => {
    const { data } = await supabase
      .from("orders")
      .select("*, tables(*)")
      .order("created_at", { ascending: false });
    setOrders(data ?? []);
  }, [supabase]);

  useEffect(() => {
    const channel = supabase
      .channel("orders-page")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, refresh)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase, refresh]);

  function addItem(item: MenuItem) {
    setCart((old) => ({ ...old, [item.id]: { item, quantity: (old[item.id]?.quantity ?? 0) + 1 } }));
  }

  function removeOne(itemId: string) {
    setCart((old) => {
      const qty = (old[itemId]?.quantity ?? 0) - 1;
      if (qty <= 0) { const next = { ...old }; delete next[itemId]; return next; }
      return { ...old, [itemId]: { ...old[itemId], quantity: qty } };
    });
  }

  function clearCart() { setCart({}); }

  async function createOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const lines = Object.values(cart);
    if (!lines.length) return;
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const { data: order } = await supabase
        .from("orders")
        .insert({
          table_id:    fd.get("table_id") as string,
          customer_id: (fd.get("customer_id") as string) || null,
          status: "pending",
          total_amount: total,
        })
        .select()
        .single();

      if (order) {
        await supabase.from("order_items").insert(
          lines.map((line) => ({
            order_id:     order.id,
            menu_item_id: line.item.id,
            quantity:     line.quantity,
            price:        line.item.price,
            subtotal:     Number(line.item.price) * line.quantity,
          })),
        );
        setCart({});
        await refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: OrderStatus) {
    await supabase.from("orders").update({ status }).eq("id", id);
    await refresh();
  }

  const cartLines = Object.values(cart);

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary))]">Service</p>
        <h1 className="text-3xl font-black tracking-tight">Order Management</h1>
      </div>

      <section className="grid gap-6 xl:grid-cols-[400px_1fr]">
        {/* ── Create Order Panel ── */}
        <form onSubmit={createOrder} className="flex flex-col gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <ShoppingCart className="size-5 text-[hsl(var(--primary))]" />
            New Order
          </h2>

          <div className="grid gap-3">
            <Select name="table_id" required>
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  Table {t.table_number} · {t.status}
                </option>
              ))}
            </Select>
            <Select name="customer_id">
              <option value="">Walk-in Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>

          {/* Menu Items Grid */}
          <div className="grid max-h-56 gap-1.5 overflow-y-auto pr-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => addItem(item)}
                className="flex items-center justify-between rounded-lg bg-[hsl(var(--muted))] px-3 py-2 text-sm text-left hover:bg-[hsl(var(--muted)/0.7)] transition-colors"
              >
                <span className="font-medium">{item.name}</span>
                <span className="text-[hsl(var(--primary))] font-semibold">{formatCurrency(item.price)}</span>
              </button>
            ))}
          </div>

          {/* Cart */}
          {cartLines.length > 0 && (
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)] p-3 grid gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Cart</span>
                <button type="button" onClick={clearCart} className="text-xs text-[hsl(var(--destructive))] hover:opacity-80 flex items-center gap-1">
                  <Trash2 className="size-3" /> Clear
                </button>
              </div>
              {cartLines.map((line) => (
                <div key={line.item.id} className="flex items-center justify-between text-sm">
                  <span className="truncate flex-1">{line.item.name}</span>
                  <div className="flex items-center gap-2 ml-2">
                    <button type="button" onClick={() => removeOne(line.item.id)} className="rounded p-0.5 hover:bg-[hsl(var(--muted))]">
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-6 text-center font-semibold">{line.quantity}</span>
                    <button type="button" onClick={() => addItem(line.item)} className="rounded p-0.5 hover:bg-[hsl(var(--muted))]">
                      <Plus className="size-3.5" />
                    </button>
                    <span className="w-16 text-right text-[hsl(var(--muted-foreground))]">{formatCurrency(Number(line.item.price) * line.quantity)}</span>
                  </div>
                </div>
              ))}
              <div className="mt-1 flex items-center justify-between border-t border-[hsl(var(--border))] pt-2 font-bold">
                <span>Total</span>
                <span className="text-[hsl(var(--primary))]">{formatCurrency(total)}</span>
              </div>
            </div>
          )}

          <Button type="submit" loading={loading} disabled={cartLines.length === 0}>
            Place Order
          </Button>
        </form>

        {/* ── Orders List ── */}
        <div className="grid gap-3 content-start">
          {orders.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[hsl(var(--border))] py-16 text-center">
              <ShoppingCart className="size-10 mb-3 text-[hsl(var(--muted-foreground))]" />
              <p className="text-sm text-[hsl(var(--muted-foreground))]">No orders yet</p>
            </div>
          )}
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="grid gap-3 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1 mt-0.5">
                      <Clock className="size-3" />
                      {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold capitalize", statusConfig[order.status as OrderStatus]?.cls ?? "")}>
                      {order.status}
                    </span>
                    <p className="text-sm font-semibold mt-1">
                      Table {(order.tables as { table_number: number } | null)?.table_number ?? "—"} · {formatCurrency(order.total_amount)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(["pending", "preparing", "ready", "served", "completed", "cancelled"] as OrderStatus[]).map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={order.status === s ? "primary" : "secondary"}
                      onClick={() => updateStatus(order.id, s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
