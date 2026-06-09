import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type OrderLine = {
  id: string;
  quantity: number;
  subtotal: number;
  menu_items?: { name: string } | null;
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase.from("orders").select("*, tables(*), customers(*), order_items(*, menu_items(*))").eq("id", id).single();

  return (
    <div className="grid gap-5">
      <div><p className="text-sm font-bold uppercase text-primary">Order Detail</p><h1 className="text-3xl font-black">Order #{id.slice(0, 8)}</h1></div>
      <Card>
        <CardHeader><CardTitle>{order?.status ?? "Not found"}</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <p className="text-sm text-muted-foreground">Table {order?.tables?.table_number ?? "N/A"} · {formatCurrency(order?.total_amount)}</p>
          <ul className="grid gap-2">
            {(order?.order_items as OrderLine[] | undefined)?.map((item) => <li key={item.id}>{item.quantity} x {item.menu_items?.name} · {formatCurrency(item.subtotal)}</li>)}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
