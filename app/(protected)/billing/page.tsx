import { BillingPanel } from "@/components/billing/billing-panel";
import { createClient } from "@/lib/supabase/server";

export default async function BillingPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("orders").select("*, tables(*), bills(*)").in("status", ["served", "completed"]).order("created_at", { ascending: false });
  return <BillingPanel orders={data ?? []} />;
}
