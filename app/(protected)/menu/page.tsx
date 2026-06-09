import { MenuManager } from "@/components/menu/menu-manager";
import { createClient } from "@/lib/supabase/server";

export default async function MenuPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("menu_categories").select("*").order("name"),
    supabase.from("menu_items").select("*, menu_categories(name)").order("name")
  ]);
  return <MenuManager categories={categories ?? []} items={items ?? []} />;
}
