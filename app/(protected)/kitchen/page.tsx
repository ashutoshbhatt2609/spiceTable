import { KitchenBoard } from "@/components/kitchen/kitchen-board";
import { createClient } from "@/lib/supabase/server";

export default async function KitchenPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, tables(*), order_items(*, menu_items(*))")
    .in("status", ["pending", "preparing", "ready"])
    .order("created_at");
  return <KitchenBoard initialOrders={data ?? []} />;
}
