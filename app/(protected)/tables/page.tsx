import { TableManager } from "@/components/tables/table-manager";
import { createClient } from "@/lib/supabase/server";

export default async function TablesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("tables").select("*").order("table_number");
  return <TableManager initialTables={data ?? []} />;
}
