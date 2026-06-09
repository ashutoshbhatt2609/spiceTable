import { CrudModule } from "@/components/shared/crud-module";

export default function PaymentsPage() {
  return (
    <CrudModule
      title="Payment Module"
      eyebrow="Cashier"
      table="payments"
      fields={[
        { name: "bill_id", label: "Bill ID" },
        { name: "amount", label: "Amount", type: "number" },
        { name: "method", label: "Method" },
        { name: "transaction_id", label: "Transaction ID" }
      ]}
      columns={["bill_id", "amount", "method", "transaction_id"]}
    />
  );
}
