"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Utensils, ImageIcon, ToggleLeft, ToggleRight, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function MenuManager({
  categories,
  items,
}: {
  categories: MenuCategory[];
  items: (MenuItem & { menu_categories?: { name: string } })[];
}) {
  const [menuItems, setMenuItems] = useState(items);
  const [cats, setCats]           = useState(categories);
  const [loadingCat, setLoadingCat] = useState(false);
  const [loadingItem, setLoadingItem] = useState(false);
  const supabase = createClient();

  const refresh = useCallback(async () => {
    const [{ data: newCats }, { data: newItems }] = await Promise.all([
      supabase.from("menu_categories").select("*").order("name"),
      supabase.from("menu_items").select("*, menu_categories(name)").order("name"),
    ]);
    setCats(newCats ?? []);
    setMenuItems(newItems ?? []);
  }, [supabase]);

  async function addCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoadingCat(true);
    try {
      await supabase.from("menu_categories").insert({
        name: fd.get("name"),
        description: fd.get("description"),
      });
      (e.target as HTMLFormElement).reset();
      await refresh();
    } finally { setLoadingCat(false); }
  }

  async function addItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoadingItem(true);
    try {
      await supabase.from("menu_items").insert({
        category_id: fd.get("category_id"),
        name:        fd.get("name"),
        description: fd.get("description"),
        price:       Number(fd.get("price")),
        image_url:   fd.get("image_url") || null,
        is_available: fd.get("is_available") === "on",
      });
      (e.target as HTMLFormElement).reset();
      await refresh();
    } finally { setLoadingItem(false); }
  }

  async function toggle(id: string, is_available: boolean) {
    await supabase.from("menu_items").update({ is_available }).eq("id", id);
    await refresh();
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this menu item?")) return;
    await supabase.from("menu_items").delete().eq("id", id);
    await refresh();
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary))]">Catalog</p>
        <h1 className="text-3xl font-black tracking-tight">Menu Management</h1>
      </div>

      <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* ── Forms ── */}
        <div className="grid gap-5 content-start">
          <form onSubmit={addCategory} className="grid gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
            <h2 className="font-bold flex items-center gap-2">
              <Plus className="size-4 text-[hsl(var(--primary))]" />
              Add Category
            </h2>
            <Input name="name" placeholder="Category name" required />
            <Input name="description" placeholder="Description (optional)" />
            <Button loading={loadingCat}>Add Category</Button>
          </form>

          <form onSubmit={addItem} className="grid gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
            <h2 className="font-bold flex items-center gap-2">
              <Utensils className="size-4 text-[hsl(var(--primary))]" />
              Add Menu Item
            </h2>
            <Select name="category_id" required>
              <option value="">Select category…</option>
              {cats.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </Select>
            <Input name="name" placeholder="Item name" required />
            <Input name="price" type="number" placeholder="Price (₹)" min="0" step="0.01" required />
            <Input name="description" placeholder="Description (optional)" />
            <Input name="image_url" placeholder="Image URL (optional)" />
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input name="is_available" type="checkbox" defaultChecked className="size-4 rounded" />
              Available for ordering
            </label>
            <Button loading={loadingItem}>Add Item</Button>
          </form>

          {/* Categories list */}
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
            <h2 className="font-bold mb-3">Categories ({cats.length})</h2>
            <ul className="grid gap-1.5">
              {cats.map((cat) => (
                <li key={cat.id} className="flex items-center gap-2 rounded-lg bg-[hsl(var(--muted)/0.5)] px-3 py-2 text-sm">
                  <span className="flex-1 font-medium">{cat.name}</span>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">{menuItems.filter((i) => i.category_id === cat.id).length} items</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Items Grid ── */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 content-start">
          {menuItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="grid gap-3 p-0">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-40 w-full rounded-t-xl object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center rounded-t-xl bg-[hsl(var(--muted)/0.5)]">
                    <ImageIcon className="size-8 text-[hsl(var(--muted-foreground))]" />
                  </div>
                )}
                <div className="p-4 pt-2 grid gap-3">
                  <div>
                    <p className="font-bold leading-tight">{item.name}</p>
                    <p className="text-xs text-[hsl(var(--primary))] font-semibold mt-0.5">{item.menu_categories?.name}</p>
                    {item.description && (
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black">{formatCurrency(item.price)}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggle(item.id, !item.is_available)}
                        className={cn("flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors", item.is_available ? "badge-ready" : "badge-cancelled")}
                      >
                        {item.is_available ? <ToggleRight className="size-3.5" /> : <ToggleLeft className="size-3.5" />}
                        {item.is_available ? "Active" : "Hidden"}
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="rounded-full p-1.5 text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.1)] transition-colors"
                        title="Delete item"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {menuItems.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-[hsl(var(--border))] py-20 text-center">
              <Utensils className="size-10 mb-3 text-[hsl(var(--muted-foreground))]" />
              <p className="font-semibold">No menu items yet</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Add your first item using the form.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
