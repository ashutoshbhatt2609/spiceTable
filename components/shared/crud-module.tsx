"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

type Field = { name: string; label: string; type?: string };

export function CrudModule({
  title, eyebrow, table, fields, columns,
}: {
  title: string;
  eyebrow: string;
  table: string;
  fields: Field[];
  columns: string[];
}) {
  const [rows, setRows]       = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // BUG FIX: stable refresh via useCallback
  const refresh = useCallback(async () => {
    const { data } = await supabase.from(table).select("*").limit(100);
    setRows(data ?? []);
  }, [supabase, table]);

  useEffect(() => { refresh(); }, [refresh]);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(
      fields.map((f) => [f.name, f.type === "number" ? Number(fd.get(f.name)) : fd.get(f.name)]),
    );
    setLoading(true);
    try {
      await supabase.from(table).insert(payload);
      (e.target as HTMLFormElement).reset();
      await refresh();
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: unknown) {
    await supabase.from(table).delete().eq("id", id);
    await refresh();
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary))]">{eyebrow}</p>
        <h1 className="text-3xl font-black tracking-tight">{title}</h1>
      </div>

      <form onSubmit={add} className="grid gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 md:grid-cols-3">
        {fields.map((f) => (
          <Input
            key={f.name}
            name={f.name}
            type={f.type ?? "text"}
            placeholder={f.label}
            required={f.name !== "email" && f.name !== "phone"}
            step={f.type === "number" ? "any" : undefined}
          />
        ))}
        <Button loading={loading}>Add {title.replace(/s$/, "")}</Button>
      </form>

      <Card>
        <CardContent className="overflow-auto p-0">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)]">
                {columns.map((col) => (
                  <th key={col} className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    {col}
                  </th>
                ))}
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-sm text-[hsl(var(--muted-foreground))]">
                    No records yet. Add one above.
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={String(row.id)} className="border-t border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-3">
                      {String(row[col] ?? "—")}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <Button size="sm" variant="danger" onClick={() => remove(row.id)}>
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
