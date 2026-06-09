create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'manager', 'cashier', 'waiter', 'kitchen');
create type public.table_status as enum ('available', 'occupied', 'reserved');
create type public.order_status as enum ('pending', 'preparing', 'ready', 'served', 'completed', 'cancelled');
create type public.payment_method as enum ('cash', 'upi', 'card');
create type public.payment_status as enum ('unpaid', 'paid', 'refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text unique not null,
  phone text,
  role public.app_role not null default 'waiter',
  created_at timestamptz not null default now()
);

create table public.tables (
  id uuid primary key default gen_random_uuid(),
  table_number integer unique not null,
  capacity integer not null check (capacity > 0),
  status public.table_status not null default 'available',
  created_at timestamptz not null default now()
);

create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text
);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_categories(id) on delete restrict,
  name text not null,
  description text,
  price numeric(10, 2) not null check (price > 0),
  image_url text,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  loyalty_points integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  table_id uuid references public.tables(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  waiter_id uuid references public.profiles(id) on delete set null,
  status public.order_status not null default 'pending',
  total_amount numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid not null references public.menu_items(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  price numeric(10, 2) not null check (price >= 0),
  subtotal numeric(10, 2) not null check (subtotal >= 0)
);

create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  item_name text not null,
  quantity integer not null default 0,
  unit text not null,
  minimum_stock integer not null default 0,
  updated_at timestamptz not null default now()
);

create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  supplier_name text not null,
  phone text,
  email text,
  address text
);

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references public.suppliers(id) on delete set null,
  amount numeric(10, 2) not null,
  purchase_date timestamptz not null default now()
);

create table public.bills (
  id uuid primary key default gen_random_uuid(),
  order_id uuid unique not null references public.orders(id) on delete cascade,
  subtotal numeric(10, 2) not null,
  tax numeric(10, 2) not null,
  discount numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  payment_status public.payment_status not null default 'unpaid',
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  amount numeric(10, 2) not null,
  method public.payment_method not null,
  transaction_id text,
  created_at timestamptz not null default now()
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  table_id uuid references public.tables(id) on delete set null,
  customer_name text not null,
  phone text not null,
  reservation_time timestamptz not null,
  status text not null default 'booked',
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  role public.app_role,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.current_role()
returns public.app_role
language sql
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.has_role(roles public.app_role[])
returns boolean
language sql
stable
as $$
  select public.current_role() = any(roles)
$$;

create or replace function public.touch_inventory()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger inventory_updated_at before update on public.inventory
for each row execute function public.touch_inventory();

create or replace function public.mark_bill_paid()
returns trigger
language plpgsql
as $$
begin
  update public.bills
  set payment_status = 'paid'
  where id = new.bill_id and (select coalesce(sum(amount), 0) from public.payments where bill_id = new.bill_id) >= total;
  return new;
end;
$$;

create trigger payments_mark_bill_paid after insert on public.payments
for each row execute function public.mark_bill_paid();

alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.order_items;
alter publication supabase_realtime add table public.notifications;

alter table public.profiles enable row level security;
alter table public.tables enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory enable row level security;
alter table public.suppliers enable row level security;
alter table public.purchases enable row level security;
alter table public.bills enable row level security;
alter table public.payments enable row level security;
alter table public.reservations enable row level security;
alter table public.notifications enable row level security;

create policy "profiles self read" on public.profiles for select using (id = auth.uid() or public.has_role(array['admin','manager']::public.app_role[]));
create policy "profiles admin manage" on public.profiles for all using (public.has_role(array['admin']::public.app_role[])) with check (public.has_role(array['admin']::public.app_role[]));

create policy "staff read tables" on public.tables for select using (auth.uid() is not null);
create policy "manage tables" on public.tables for all using (public.has_role(array['admin','manager','waiter']::public.app_role[])) with check (public.has_role(array['admin','manager','waiter']::public.app_role[]));

create policy "read menu categories" on public.menu_categories for select using (true);
create policy "manage menu categories" on public.menu_categories for all using (public.has_role(array['admin','manager']::public.app_role[])) with check (public.has_role(array['admin','manager']::public.app_role[]));

create policy "read menu items" on public.menu_items for select using (true);
create policy "manage menu items" on public.menu_items for all using (public.has_role(array['admin','manager']::public.app_role[])) with check (public.has_role(array['admin','manager']::public.app_role[]));

create policy "staff customers" on public.customers for all using (public.has_role(array['admin','manager','cashier','waiter']::public.app_role[])) with check (public.has_role(array['admin','manager','cashier','waiter']::public.app_role[]));

create policy "staff read orders" on public.orders for select using (auth.uid() is not null or table_id is not null);
create policy "create orders" on public.orders for insert with check (true);
create policy "update orders by staff" on public.orders for update using (public.has_role(array['admin','manager','cashier','waiter','kitchen']::public.app_role[])) with check (public.has_role(array['admin','manager','cashier','waiter','kitchen']::public.app_role[]));

create policy "read order items" on public.order_items for select using (auth.uid() is not null);
create policy "create order items" on public.order_items for insert with check (true);
create policy "manage order items" on public.order_items for update using (public.has_role(array['admin','manager','waiter']::public.app_role[])) with check (public.has_role(array['admin','manager','waiter']::public.app_role[]));

create policy "manage inventory" on public.inventory for all using (public.has_role(array['admin','manager']::public.app_role[])) with check (public.has_role(array['admin','manager']::public.app_role[]));
create policy "manage suppliers" on public.suppliers for all using (public.has_role(array['admin','manager']::public.app_role[])) with check (public.has_role(array['admin','manager']::public.app_role[]));
create policy "manage purchases" on public.purchases for all using (public.has_role(array['admin','manager']::public.app_role[])) with check (public.has_role(array['admin','manager']::public.app_role[]));

create policy "cashier bills" on public.bills for all using (public.has_role(array['admin','manager','cashier']::public.app_role[])) with check (public.has_role(array['admin','manager','cashier']::public.app_role[]));
create policy "cashier payments" on public.payments for all using (public.has_role(array['admin','manager','cashier']::public.app_role[])) with check (public.has_role(array['admin','manager','cashier']::public.app_role[]));
create policy "staff reservations" on public.reservations for all using (public.has_role(array['admin','manager','waiter']::public.app_role[])) with check (public.has_role(array['admin','manager','waiter']::public.app_role[]));
create policy "read notifications" on public.notifications for select using (role is null or role = public.current_role());
create policy "create notifications" on public.notifications for insert with check (auth.uid() is not null);

insert into public.menu_categories (name, description) values
('Starters', 'Small plates and appetizers'),
('Main Course', 'Primary meal dishes'),
('Desserts', 'Sweet dishes'),
('Beverages', 'Drinks')
on conflict (name) do nothing;

insert into public.tables (table_number, capacity, status) values
(1, 2, 'available'), (2, 4, 'available'), (3, 4, 'reserved'), (4, 6, 'occupied'), (5, 8, 'available')
on conflict (table_number) do nothing;

insert into public.menu_items (category_id, name, description, price, image_url, is_available)
select id, 'Paneer Tikka', 'Smoky paneer with peppers and mint chutney.', 180, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80', true from public.menu_categories where name = 'Starters'
union all select id, 'Veg Biryani', 'Basmati rice with vegetables and spices.', 220, 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80', true from public.menu_categories where name = 'Main Course'
union all select id, 'Gulab Jamun', 'Warm syrup dessert.', 90, null, true from public.menu_categories where name = 'Desserts'
union all select id, 'Cold Coffee', 'Chilled coffee with ice cream.', 110, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80', true from public.menu_categories where name = 'Beverages';

insert into public.inventory (item_name, quantity, unit, minimum_stock) values
('Paneer', 8, 'kg', 5),
('Basmati Rice', 30, 'kg', 10),
('Milk', 12, 'litre', 15)
on conflict do nothing;

create or replace view public.sales_report as
select date_trunc('day', created_at)::date as day, count(*) as orders, coalesce(sum(total_amount), 0) as revenue
from public.orders
where status in ('served', 'completed')
group by 1
order by 1 desc;

create or replace view public.low_stock_items as
select * from public.inventory where quantity <= minimum_stock;

create or replace view public.top_selling_items as
select mi.name, sum(oi.quantity) as total_quantity, sum(oi.subtotal) as revenue
from public.order_items oi
join public.menu_items mi on mi.id = oi.menu_item_id
group by mi.name
order by total_quantity desc;

insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;
