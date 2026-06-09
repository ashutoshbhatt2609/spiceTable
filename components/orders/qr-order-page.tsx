"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MenuItem, RestaurantTable } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function QrOrderPage({ table, menuItems }: { table: RestaurantTable | null; menuItems: MenuItem[] }) {
  const [cart, setCart] = useState<Record<string, { item: MenuItem; quantity: number }>>({});
  const total = useMemo(() => Object.values(cart).reduce((sum, line) => sum + Number(line.item.price) * line.quantity, 0), [cart]);
  const supabase = createClient();

  async function placeOrder() {
    if (!table || total <= 0) return;
    const { data: order } = await supabase.from("orders").insert({ table_id: table.id, status: "pending", total_amount: total }).select().single();
    if (order) {
      await supabase.from("order_items").insert(Object.values(cart).map((line) => ({
        order_id: order.id,
        menu_item_id: line.item.id,
        quantity: line.quantity,
        price: line.item.price,
        subtotal: Number(line.item.price) * line.quantity
      })));
      setCart({});
      alert("Order sent to kitchen.");
    }
  }

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-5xl gap-5 p-5">
      <div><p className="text-sm font-bold uppercase text-primary">QR Ordering</p><h1 className="text-3xl font-black">Table {table?.table_number ?? "Not Found"}</h1></div>
      <section className="grid gap-3 md:grid-cols-2">
        {menuItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div><strong>{item.name}</strong><p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p></div>
              <Button onClick={() => setCart((old) => ({ ...old, [item.id]: { item, quantity: (old[item.id]?.quantity ?? 0) + 1 } }))}>Add</Button>
            </CardContent>
          </Card>
        ))}
      </section>
      <div className="sticky bottom-4 flex items-center justify-between rounded-md border bg-card p-4 shadow-sm">
        <strong>Total: {formatCurrency(total)}</strong>
        <Button onClick={placeOrder}>Place Order</Button>
      </div>
    </main>
  );
}
