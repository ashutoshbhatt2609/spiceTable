import { CrudModule } from "@/components/shared/crud-module";

export default function ReservationsPage() {
  return (
    <CrudModule
      title="Reservation System"
      eyebrow="Bookings"
      table="reservations"
      fields={[
        { name: "customer_name", label: "Customer Name" },
        { name: "phone", label: "Phone" },
        { name: "reservation_time", label: "Date and Time", type: "datetime-local" },
        { name: "status", label: "Status" }
      ]}
      columns={["customer_name", "phone", "reservation_time", "status"]}
    />
  );
}
