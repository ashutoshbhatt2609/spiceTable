"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Receipt, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";

type Bill = { id?: string; payment_status?: string };
type BillOrder = {
  id: string;
  total_amount: number;
  tables?: { table_number: number } | null;
  bills?: Bill | Bill[] | null;
};

function getBill(b: Bill | Bill[] | null | undefined): Bill | null {
  if (!b) return null;
  if (Array.isArray(b)) return b[0] ?? null;
  return b;
}

export function BillingPanel({ orders }: { orders: BillOrder[] }) {
  const supabase = createClient();
  const [generating, setGenerating] = useState<string | null>(null);

  async function generate(order: BillOrder) {
    const existingBill = getBill(order.bills);
    // BUG FIX: prevent duplicate bill creation
    if (existingBill?.id) {
      downloadPdf(order, existingBill);
      return;
    }

    setGenerating(order.id);
    try {
      const subtotal = Number(order.total_amount);
      const tax      = Math.round(subtotal * 0.05 * 100) / 100;
      const total    = subtotal + tax;

      const { data: bill } = await supabase
        .from("bills")
        .insert({ order_id: order.id, subtotal, tax, discount: 0, total, payment_status: "unpaid" })
        .select()
        .single();

      if (bill) downloadPdf(order, bill);
    } finally {
      setGenerating(null);
    }
  }

  function downloadPdf(order: BillOrder, bill: Bill) {
    const subtotal = Number(order.total_amount);
    const tax      = Math.round(subtotal * 0.05 * 100) / 100;
    const total    = subtotal + tax;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Spice Table", 20, 24);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Restaurant Management System", 20, 32);
    doc.text("-----------------------------------", 20, 38);

    doc.setFontSize(12);
    doc.text(`Invoice for Order: #${order.id.slice(0, 8).toUpperCase()}`, 20, 48);
    doc.text(`Table: ${order.tables?.table_number ?? "N/A"}`, 20, 56);
    doc.text(`Status: ${bill.payment_status ?? "unpaid"}`, 20, 64);
    doc.text("-----------------------------------", 20, 70);

    doc.text(`Subtotal:  ${formatCurrency(subtotal)}`, 20, 80);
    doc.text(`GST (5%):  ${formatCurrency(tax)}`, 20, 88);
    doc.text(`Discount:  ${formatCurrency(0)}`, 20, 96);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL:     ${formatCurrency(total)}`, 20, 108);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Thank you for dining at Spice Table!", 20, 124);

    doc.save(`invoice-${order.id.slice(0, 8)}.pdf`);
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--primary))]">Invoices</p>
        <h1 className="text-3xl font-black tracking-tight">Billing System</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{orders.length} orders ready for billing</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[hsl(var(--border))] py-20 text-center">
          <Receipt className="size-10 mb-3 text-[hsl(var(--muted-foreground))]" />
          <p className="font-semibold">No orders to bill</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Served and completed orders will appear here.</p>
        </div>
      ) : (
        <section className="grid gap-3">
          {orders.map((order) => {
            const bill = getBill(order.bills);
            const isPaid = bill?.payment_status === "paid";
            return (
              <Card key={order.id}>
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "flex size-10 items-center justify-center rounded-xl",
                      isPaid ? "bg-[hsl(var(--success)/0.1)]" : "bg-[hsl(var(--warning)/0.1)]"
                    )}>
                      {isPaid
                        ? <CheckCircle className="size-5 text-[hsl(var(--success))]" />
                        : <AlertCircle className="size-5 text-[hsl(var(--warning))]" />
                      }
                    </div>
                    <div>
                      <p className="font-bold">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Table {order.tables?.table_number ?? "N/A"} · {formatCurrency(order.total_amount)}
                      </p>
                      {bill && (
                        <p className={cn("text-xs font-semibold mt-0.5", isPaid ? "text-[hsl(var(--success))]" : "text-[hsl(var(--warning))]")}>
                          Bill: {bill.payment_status}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => generate(order)}
                    loading={generating === order.id}
                    variant={isPaid ? "secondary" : "primary"}
                    size="sm"
                  >
                    <Receipt className="size-4" />
                    {bill?.id ? "Download PDF" : "Generate & Download"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}
    </div>
  );
}
