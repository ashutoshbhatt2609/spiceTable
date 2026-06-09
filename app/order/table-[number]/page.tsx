import { QrOrderPage } from "@/components/orders/qr-order-page";
import { createClient } from "@/lib/supabase/server";

export default async function TableOrderPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const supabase = await createClient();
  const [{ data: table }, { data: menuItems }] = await Promise.all([
    supabase.from("tables").select("*").eq("table_number", Number(number)).single(),
    supabase.from("menu_items").select("*").eq("is_available", true).order("name")
  ]);
  return <QrOrderPage table={table} menuItems={menuItems ?? []} />;
}
