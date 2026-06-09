import { CrudModule } from "@/components/shared/crud-module";

export default function CustomersPage() {
  return (
    <CrudModule
      title="Customer Management"
      eyebrow="CRM"
      table="customers"
      fields={[
        { name: "name", label: "Name" },
        { name: "phone", label: "Phone" },
        { name: "email", label: "Email", type: "email" },
        { name: "loyalty_points", label: "Loyalty Points", type: "number" }
      ]}
      columns={["name", "phone", "email", "loyalty_points"]}
    />
  );
}
