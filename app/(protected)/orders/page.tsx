import { OrderManager } from "@/components/orders/order-manager";
import { createClient } from "@/lib/supabase/server";

export default async function OrdersPage() {
  const supabase = await createClient();
  const [{ data: orders }, { data: tables }, { data: menuItems }, { data: customers }] = await Promise.all([
    supabase.from("orders").select("*, tables(*)").order("created_at", { ascending: false }),
    supabase.from("tables").select("*").order("table_number"),
    supabase.from("menu_items").select("*").eq("is_available", true).order("name"),
    supabase.from("customers").select("*").order("name")
  ]);
  return <OrderManager initialOrders={orders ?? []} tables={tables ?? []} menuItems={menuItems ?? []} customers={customers ?? []} />;
}
