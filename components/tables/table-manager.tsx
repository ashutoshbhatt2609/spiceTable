"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RestaurantTable, TableStatus } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function TableManager({ initialTables }: { initialTables: RestaurantTable[] }) {
  const [tables, setTables] = useState(initialTables);
  const supabase = createClient();

  async function refresh() {
    const { data } = await supabase.from("tables").select("*").order("table_number");
    setTables(data ?? []);
  }

  async function addTable(formData: FormData) {
    await supabase.from("tables").insert({
      table_number: Number(formData.get("table_number")),
      capacity: Number(formData.get("capacity")),
      status: formData.get("status")
    });
    refresh();
  }

  async function updateStatus(id: string, status: TableStatus) {
    await supabase.from("tables").update({ status }).eq("id", id);
    refresh();
  }

  return (
    <div className="grid gap-5">
      <div><p className="text-sm font-bold uppercase text-primary">Floor</p><h1 className="text-3xl font-black">Table Management</h1></div>
      <form action={addTable} className="grid gap-3 rounded-md border bg-card p-4 md:grid-cols-[1fr_1fr_1fr_auto]">
        <Input name="table_number" type="number" placeholder="Table number" required />
        <Input name="capacity" type="number" placeholder="Capacity" required />
        <select name="status" className="h-10 rounded-md border bg-white px-3 text-sm">
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="reserved">Reserved</option>
        </select>
        <Button>Add Table</Button>
      </form>
      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        {tables.map((table) => (
          <Card key={table.id}>
            <CardContent className="grid gap-4 p-5">
              <div className="flex items-center justify-between">
                <strong className="text-xl">Table {table.table_number}</strong>
                <span className={cn("rounded-full px-3 py-1 text-xs font-bold text-white", table.status === "available" && "bg-green-700", table.status === "occupied" && "bg-red-700", table.status === "reserved" && "bg-yellow-600")}>{table.status}</span>
              </div>
              <p className="text-sm text-muted-foreground">Capacity: {table.capacity}</p>
              <div className="grid grid-cols-3 gap-2">
                {(["available", "occupied", "reserved"] as TableStatus[]).map((status) => (
                  <Button key={status} type="button" variant="secondary" className="px-2" onClick={() => updateStatus(table.id, status)}>{status}</Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
