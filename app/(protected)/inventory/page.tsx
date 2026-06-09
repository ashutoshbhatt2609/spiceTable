import { CrudModule } from "@/components/shared/crud-module";

export default function InventoryPage() {
  return (
    <CrudModule
      title="Inventory Management"
      eyebrow="Stock"
      table="inventory"
      fields={[
        { name: "item_name", label: "Item Name" },
        { name: "quantity", label: "Quantity", type: "number" },
        { name: "unit", label: "Unit" },
        { name: "minimum_stock", label: "Minimum Stock", type: "number" }
      ]}
      columns={["item_name", "quantity", "unit", "minimum_stock"]}
    />
  );
}
