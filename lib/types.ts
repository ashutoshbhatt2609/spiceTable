export type Role = "admin" | "manager" | "cashier" | "waiter" | "kitchen";
export type TableStatus = "available" | "occupied" | "reserved";
export type OrderStatus = "pending" | "preparing" | "ready" | "served" | "completed" | "cancelled";
export type PaymentMethod = "cash" | "upi" | "card";

export type Profile = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  created_at: string;
};

export type RestaurantTable = {
  id: string;
  table_number: number;
  capacity: number;
  status: TableStatus;
  created_at: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  description: string | null;
};

export type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  table_id: string | null;
  customer_id: string | null;
  waiter_id: string | null;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  tables?: RestaurantTable | null;
};

export type OrderItem = {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price: number;
  subtotal: number;
  menu_items?: MenuItem | null;
};

export type InventoryItem = {
  id: string;
  item_name: string;
  quantity: number;
  unit: string;
  minimum_stock: number;
  updated_at: string;
};
