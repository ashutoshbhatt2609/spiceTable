-- ============================================================
-- Spice Table Restaurant – Seed Data
-- Run this AFTER schema.sql in the Supabase SQL Editor.
-- It is idempotent: all inserts use ON CONFLICT DO NOTHING
-- or ON CONFLICT DO UPDATE so it can be re-run safely.
-- ============================================================

-- ── 1. Menu Categories (extend beyond schema defaults) ────────
insert into public.menu_categories (name, description) values
  ('Starters',    'Small plates and appetizers'),
  ('Main Course', 'Primary meal dishes'),
  ('Breads',      'Indian breads and rotis'),
  ('Rice & Biryani', 'Aromatic rice dishes'),
  ('Desserts',    'Sweet dishes'),
  ('Beverages',   'Drinks'),
  ('Soups',       'Hot and cold soups'),
  ('Salads',      'Fresh salads')
on conflict (name) do nothing;

-- ── 2. Dining Tables ─────────────────────────────────────────
insert into public.tables (table_number, capacity, status) values
  (1,  2,  'available'),
  (2,  4,  'available'),
  (3,  4,  'reserved'),
  (4,  6,  'occupied'),
  (5,  8,  'available'),
  (6,  2,  'available'),
  (7,  4,  'occupied'),
  (8,  6,  'available'),
  (9,  8,  'reserved'),
  (10, 10, 'available')
on conflict (table_number) do update
  set capacity = excluded.capacity, status = excluded.status;

-- ── 3. Menu Items ─────────────────────────────────────────────
-- Starters
insert into public.menu_items (category_id, name, description, price, image_url, is_available)
select id, 'Paneer Tikka',        'Smoky paneer with peppers and mint chutney.',             180, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80', true  from public.menu_categories where name = 'Starters' union all
select id, 'Veg Spring Roll',     'Crispy rolls stuffed with stir-fried vegetables.',         120, 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&w=800&q=80', true  from public.menu_categories where name = 'Starters' union all
select id, 'Hara Bhara Kebab',    'Spinach and pea patties with tamarind chutney.',           150, null, true  from public.menu_categories where name = 'Starters' union all
select id, 'Aloo Tikki',          'Spiced potato patties served with chutneys.',              100, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80', true  from public.menu_categories where name = 'Starters' union all
select id, 'Chicken Tikka',       'Tandoor-marinated chicken with onion rings.',              240, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80', true  from public.menu_categories where name = 'Starters' union all

-- Main Course
select id, 'Paneer Butter Masala','Paneer in rich tomato-butter gravy.',                      280, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', true  from public.menu_categories where name = 'Main Course' union all
select id, 'Dal Makhani',         'Black lentils slow-cooked with cream and spices.',         220, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', true  from public.menu_categories where name = 'Main Course' union all
select id, 'Veg Kadai',           'Mix vegetables in kadai masala.',                          200, null, true  from public.menu_categories where name = 'Main Course' union all
select id, 'Chicken Curry',       'Home-style chicken in onion-tomato gravy.',                300, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80', true  from public.menu_categories where name = 'Main Course' union all
select id, 'Mutton Rogan Josh',   'Slow-cooked mutton in aromatic Kashmiri spices.',          380, 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=800&q=80', true  from public.menu_categories where name = 'Main Course' union all
select id, 'Palak Paneer',        'Cottage cheese in creamy spinach gravy.',                  250, null, true  from public.menu_categories where name = 'Main Course' union all

-- Breads
select id, 'Butter Naan',         'Leavened bread baked in tandoor with butter.',              50, null, true  from public.menu_categories where name = 'Breads' union all
select id, 'Garlic Naan',         'Naan topped with garlic and coriander.',                    60, null, true  from public.menu_categories where name = 'Breads' union all
select id, 'Tandoori Roti',       'Whole wheat roti baked in clay oven.',                      40, null, true  from public.menu_categories where name = 'Breads' union all
select id, 'Paratha',             'Layered whole-wheat flatbread.',                             50, null, true  from public.menu_categories where name = 'Breads' union all

-- Rice & Biryani
select id, 'Veg Biryani',         'Basmati rice with vegetables and whole spices.',           220, 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80', true  from public.menu_categories where name = 'Rice & Biryani' union all
select id, 'Chicken Biryani',     'Fragrant basmati with spiced chicken.',                    320, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', true  from public.menu_categories where name = 'Rice & Biryani' union all
select id, 'Steamed Rice',        'Plain steamed basmati rice.',                               80, null, true  from public.menu_categories where name = 'Rice & Biryani' union all

-- Desserts
select id, 'Gulab Jamun',         'Warm milk-solid dumplings in sugar syrup.',                 90, null, true  from public.menu_categories where name = 'Desserts' union all
select id, 'Rasmalai',            'Soft paneer discs in saffron milk.',                        110, null, true  from public.menu_categories where name = 'Desserts' union all
select id, 'Kheer',               'Rice pudding with cardamom and nuts.',                      100, null, true  from public.menu_categories where name = 'Desserts' union all
select id, 'Chocolate Brownie',   'Warm brownie with vanilla ice cream.',                      150, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80', true  from public.menu_categories where name = 'Desserts' union all

-- Beverages
select id, 'Cold Coffee',         'Chilled coffee with ice cream.',                            110, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80', true  from public.menu_categories where name = 'Beverages' union all
select id, 'Mango Lassi',         'Thick mango-yogurt smoothie.',                               90, null, true  from public.menu_categories where name = 'Beverages' union all
select id, 'Masala Chai',         'Spiced Indian tea with milk.',                               40, null, true  from public.menu_categories where name = 'Beverages' union all
select id, 'Fresh Lime Soda',     'Tangy lime soda, sweet or salted.',                          60, null, true  from public.menu_categories where name = 'Beverages' union all
select id, 'Mineral Water',       'Chilled bottled water.',                                     30, null, true  from public.menu_categories where name = 'Beverages' union all

-- Soups
select id, 'Tomato Soup',         'Velvety tomato soup with croutons.',                         90, null, true  from public.menu_categories where name = 'Soups' union all
select id, 'Sweet Corn Soup',     'Classic sweet corn soup with pepper.',                       100, null, true  from public.menu_categories where name = 'Soups' union all
select id, 'Manchow Soup',        'Indo-Chinese thick soup with crispy noodles.',               110, null, true  from public.menu_categories where name = 'Soups' union all

-- Salads
select id, 'Garden Salad',        'Fresh seasonal vegetables with dressing.',                   80, null, true  from public.menu_categories where name = 'Salads' union all
select id, 'Caesar Salad',        'Romaine lettuce, croutons and Caesar dressing.',             120, null, false from public.menu_categories where name = 'Salads';

-- ── 4. Inventory ──────────────────────────────────────────────
insert into public.inventory (item_name, quantity, unit, minimum_stock) values
  ('Paneer',            8,   'kg',    5),
  ('Basmati Rice',      30,  'kg',   10),
  ('Milk',              12,  'litre', 15),
  ('Chicken',           15,  'kg',    8),
  ('Mutton',            5,   'kg',    3),
  ('Tomatoes',          20,  'kg',    5),
  ('Onions',            25,  'kg',   10),
  ('Garlic',            3,   'kg',    2),
  ('Ginger',            2,   'kg',    1),
  ('Cooking Oil',       10,  'litre', 5),
  ('Butter',            4,   'kg',    2),
  ('Cream',             6,   'litre', 3),
  ('Flour (Maida)',     15,  'kg',    5),
  ('Whole Wheat Flour', 12,  'kg',    5),
  ('Sugar',             8,   'kg',    3),
  ('Salt',              5,   'kg',    2),
  ('Cumin Seeds',       1,   'kg',    0.5),
  ('Coriander Powder',  1,   'kg',    0.5),
  ('Garam Masala',      0.5, 'kg',    0.3),
  ('Cardamom',          0.2, 'kg',    0.1),
  ('Saffron',           0.05,'kg',    0.02),
  ('Coffee Powder',     2,   'kg',    1),
  ('Tea Leaves',        3,   'kg',    1),
  ('Mineral Water Btl', 48,  'nos',  24),
  ('Lemons',            30,  'nos',  10),
  ('Spinach',           4,   'kg',    2),
  ('Black Lentils',     6,   'kg',    3),
  ('Yellow Lentils',    8,   'kg',    3),
  ('LPG Cylinder',      2,   'nos',   1),
  ('Disposable Gloves', 3,   'box',   1)
on conflict do nothing;

-- ── 5. Suppliers ─────────────────────────────────────────────
insert into public.suppliers (supplier_name, phone, email, address) values
  ('Fresh Farm Produce',   '9876543210', 'freshfarm@mail.com',  '12 Market Road, Bengaluru'),
  ('Royal Dairy',          '9123456789', 'royaldairy@mail.com', '45 Milk Colony, Mysuru'),
  ('Chicken Express',      '9234567890', 'chickenexp@mail.com', '78 Poultry Lane, Hubli'),
  ('Spice Hub',            '9345678901', 'spicehub@mail.com',   '22 Spice Bazaar, Chennai'),
  ('National Gas Agency',  '9456789012', 'natgas@mail.com',     '5 Industrial Area, Tumkur'),
  ('Kumar Rice Mills',     '9567890123', 'kumarrice@mail.com',  '90 Mill Road, Hassan')
on conflict do nothing;

-- ── 6. Purchases ─────────────────────────────────────────────
insert into public.purchases (supplier_id, amount, purchase_date)
select s.id, 4200.00, now() - interval '30 days' from public.suppliers s where s.supplier_name = 'Fresh Farm Produce' union all
select s.id, 3600.00, now() - interval '25 days' from public.suppliers s where s.supplier_name = 'Royal Dairy' union all
select s.id, 8500.00, now() - interval '20 days' from public.suppliers s where s.supplier_name = 'Chicken Express' union all
select s.id, 1800.00, now() - interval '18 days' from public.suppliers s where s.supplier_name = 'Spice Hub' union all
select s.id, 900.00,  now() - interval '15 days' from public.suppliers s where s.supplier_name = 'National Gas Agency' union all
select s.id, 5100.00, now() - interval '12 days' from public.suppliers s where s.supplier_name = 'Kumar Rice Mills' union all
select s.id, 3900.00, now() - interval '8 days'  from public.suppliers s where s.supplier_name = 'Fresh Farm Produce' union all
select s.id, 2700.00, now() - interval '4 days'  from public.suppliers s where s.supplier_name = 'Royal Dairy' union all
select s.id, 7200.00, now() - interval '2 days'  from public.suppliers s where s.supplier_name = 'Chicken Express';

-- ── 7. Customers ─────────────────────────────────────────────
insert into public.customers (name, phone, email, loyalty_points) values
  ('Arjun Sharma',    '9811001100', 'arjun.sharma@email.com',    150),
  ('Priya Nair',      '9822002200', 'priya.nair@email.com',      320),
  ('Rahul Gupta',     '9833003300', 'rahul.gupta@email.com',      80),
  ('Sneha Reddy',     '9844004400', 'sneha.reddy@email.com',     210),
  ('Karan Mehta',     '9855005500', 'karan.mehta@email.com',      50),
  ('Ananya Iyer',     '9866006600', 'ananya.iyer@email.com',     470),
  ('Vikram Singh',    '9877007700', 'vikram.singh@email.com',    130),
  ('Divya Patel',     '9888008800', 'divya.patel@email.com',     290),
  ('Rohit Joshi',     '9899009900', 'rohit.joshi@email.com',      60),
  ('Meera Krishnan',  '9800100200', 'meera.k@email.com',         540),
  ('Suresh Babu',     '9811200300', null,                          0),
  ('Fatima Shaikh',   '9822300400', 'fatima.s@email.com',        180),
  ('Amit Kumar',      '9833400500', null,                         90),
  ('Pooja Verma',     '9844500600', 'pooja.v@email.com',         360),
  ('Naveen Rao',      '9855600700', 'naveen.rao@email.com',       20)
on conflict do nothing;

-- ── 8. Reservations ──────────────────────────────────────────
insert into public.reservations (table_id, customer_name, phone, reservation_time, status)
select t.id, 'Arjun Sharma',   '9811001100', now() + interval '1 day'  + interval '12 hours', 'booked'    from public.tables t where table_number = 3 union all
select t.id, 'Priya Nair',     '9822002200', now() + interval '2 days' + interval '19 hours', 'booked'    from public.tables t where table_number = 9 union all
select t.id, 'Birthday Party', '9000000001', now() + interval '3 days' + interval '20 hours', 'booked'    from public.tables t where table_number = 5 union all
select t.id, 'Rahul Gupta',    '9833003300', now() - interval '1 day'  + interval '13 hours', 'completed' from public.tables t where table_number = 2 union all
select t.id, 'Anniversary',    '9000000002', now() - interval '2 days' + interval '20 hours', 'completed' from public.tables t where table_number = 6 union all
select t.id, 'Sneha Reddy',    '9844004400', now() + interval '5 days' + interval '14 hours', 'booked'    from public.tables t where table_number = 8;

-- ── 9. Sample Orders (last 14 days) with items, bills, payments ──
-- We create each order using a DO block so we can capture the generated UUID.

do $$
declare
  ord_id      uuid;
  bill_id     uuid;
  tbl_id      uuid;
  cust_id     uuid;
  cat_starter uuid;
  cat_main    uuid;
  cat_bev     uuid;
  cat_dessert uuid;
  cat_bread   uuid;
  cat_rice    uuid;

  -- item ids
  i_paneer_tikka     uuid;
  i_spring_roll      uuid;
  i_aloo_tikki       uuid;
  i_chicken_tikka    uuid;
  i_pbm              uuid;
  i_dal_makhani      uuid;
  i_chicken_curry    uuid;
  i_mutton_rj        uuid;
  i_palak            uuid;
  i_veg_biryani      uuid;
  i_chicken_biryani  uuid;
  i_naan             uuid;
  i_garlic_naan      uuid;
  i_roti             uuid;
  i_gulab            uuid;
  i_rasmalai         uuid;
  i_cold_coffee      uuid;
  i_lassi            uuid;
  i_chai             uuid;
  i_water            uuid;
  i_tom_soup         uuid;

  sub   numeric;
  tax   numeric;
  tot   numeric;

begin
  -- cache category ids
  select id into cat_starter  from public.menu_categories where name = 'Starters';
  select id into cat_main     from public.menu_categories where name = 'Main Course';
  select id into cat_bev      from public.menu_categories where name = 'Beverages';
  select id into cat_dessert  from public.menu_categories where name = 'Desserts';
  select id into cat_bread    from public.menu_categories where name = 'Breads';
  select id into cat_rice     from public.menu_categories where name = 'Rice & Biryani';

  -- cache item ids
  select id into i_paneer_tikka    from public.menu_items where name = 'Paneer Tikka';
  select id into i_spring_roll     from public.menu_items where name = 'Veg Spring Roll';
  select id into i_aloo_tikki      from public.menu_items where name = 'Aloo Tikki';
  select id into i_chicken_tikka   from public.menu_items where name = 'Chicken Tikka';
  select id into i_pbm             from public.menu_items where name = 'Paneer Butter Masala';
  select id into i_dal_makhani     from public.menu_items where name = 'Dal Makhani';
  select id into i_chicken_curry   from public.menu_items where name = 'Chicken Curry';
  select id into i_mutton_rj       from public.menu_items where name = 'Mutton Rogan Josh';
  select id into i_palak           from public.menu_items where name = 'Palak Paneer';
  select id into i_veg_biryani     from public.menu_items where name = 'Veg Biryani';
  select id into i_chicken_biryani from public.menu_items where name = 'Chicken Biryani';
  select id into i_naan            from public.menu_items where name = 'Butter Naan';
  select id into i_garlic_naan     from public.menu_items where name = 'Garlic Naan';
  select id into i_roti            from public.menu_items where name = 'Tandoori Roti';
  select id into i_gulab           from public.menu_items where name = 'Gulab Jamun';
  select id into i_rasmalai        from public.menu_items where name = 'Rasmalai';
  select id into i_cold_coffee     from public.menu_items where name = 'Cold Coffee';
  select id into i_lassi           from public.menu_items where name = 'Mango Lassi';
  select id into i_chai            from public.menu_items where name = 'Masala Chai';
  select id into i_water           from public.menu_items where name = 'Mineral Water';
  select id into i_tom_soup        from public.menu_items where name = 'Tomato Soup';

  -- === ORDER 1: 14 days ago – completed + paid ===
  select id into tbl_id  from public.tables   where table_number = 2;
  select id into cust_id from public.customers where name = 'Arjun Sharma';
  insert into public.orders (table_id, customer_id, status, total_amount, created_at)
    values (tbl_id, cust_id, 'completed', 710, now() - interval '14 days') returning id into ord_id;
  insert into public.order_items (order_id, menu_item_id, quantity, price, subtotal) values
    (ord_id, i_paneer_tikka,    1, 180, 180),
    (ord_id, i_dal_makhani,     1, 220, 220),
    (ord_id, i_naan,            2,  50, 100),
    (ord_id, i_gulab,           1,  90,  90),
    (ord_id, i_cold_coffee,     1, 110, 110);
  sub := 710; tax := round(sub * 0.05, 2); tot := sub + tax;
  insert into public.bills (order_id, subtotal, tax, discount, total, payment_status, created_at)
    values (ord_id, sub, tax, 0, tot, 'paid', now() - interval '14 days') returning id into bill_id;
  insert into public.payments (bill_id, amount, method, transaction_id, created_at)
    values (bill_id, tot, 'upi', 'UPI14D001', now() - interval '14 days');

  -- === ORDER 2: 13 days ago – completed + paid ===
  select id into tbl_id  from public.tables   where table_number = 4;
  select id into cust_id from public.customers where name = 'Priya Nair';
  insert into public.orders (table_id, customer_id, status, total_amount, created_at)
    values (tbl_id, cust_id, 'completed', 980, now() - interval '13 days') returning id into ord_id;
  insert into public.order_items (order_id, menu_item_id, quantity, price, subtotal) values
    (ord_id, i_chicken_tikka,   1, 240, 240),
    (ord_id, i_chicken_curry,   1, 300, 300),
    (ord_id, i_garlic_naan,     2,  60, 120),
    (ord_id, i_lassi,           2,  90, 180),
    (ord_id, i_gulab,           1,  90,  90);
  sub := 980; tax := round(sub * 0.05, 2); tot := sub + tax;
  insert into public.bills (order_id, subtotal, tax, discount, total, payment_status, created_at)
    values (ord_id, sub, tax, 50, tot - 50, 'paid', now() - interval '13 days') returning id into bill_id;
  insert into public.payments (bill_id, amount, method, transaction_id, created_at)
    values (bill_id, tot - 50, 'card', 'CARD13D002', now() - interval '13 days');

  -- === ORDER 3: 12 days ago – completed + cash ===
  select id into tbl_id  from public.tables   where table_number = 1;
  select id into cust_id from public.customers where name = 'Rahul Gupta';
  insert into public.orders (table_id, customer_id, status, total_amount, created_at)
    values (tbl_id, cust_id, 'completed', 490, now() - interval '12 days') returning id into ord_id;
  insert into public.order_items (order_id, menu_item_id, quantity, price, subtotal) values
    (ord_id, i_veg_biryani,  1, 220, 220),
    (ord_id, i_tom_soup,     1,  90,  90),
    (ord_id, i_roti,         2,  40,  80),
    (ord_id, i_rasmalai,     1, 110, 110);
  sub := 490; tax := round(sub * 0.05, 2); tot := sub + tax;
  insert into public.bills (order_id, subtotal, tax, discount, total, payment_status, created_at)
    values (ord_id, sub, tax, 0, tot, 'paid', now() - interval '12 days') returning id into bill_id;
  insert into public.payments (bill_id, amount, method, created_at)
    values (bill_id, tot, 'cash', now() - interval '12 days');

  -- === ORDER 4: 11 days ago – completed ===
  select id into tbl_id  from public.tables   where table_number = 5;
  select id into cust_id from public.customers where name = 'Sneha Reddy';
  insert into public.orders (table_id, customer_id, status, total_amount, created_at)
    values (tbl_id, cust_id, 'completed', 1320, now() - interval '11 days') returning id into ord_id;
  insert into public.order_items (order_id, menu_item_id, quantity, price, subtotal) values
    (ord_id, i_paneer_tikka,    2, 180, 360),
    (ord_id, i_mutton_rj,       1, 380, 380),
    (ord_id, i_naan,            4,  50, 200),
    (ord_id, i_chicken_biryani, 1, 320, 320),
    (ord_id, i_gulab,           2,  90, 180),
    (ord_id, i_water,           2,  30,  60);
  sub := 1320; -- (adjusted)
  insert into public.orders (table_id, customer_id, status, total_amount, created_at)
    values (tbl_id, null, 'completed', 620, now() - interval '11 days' - interval '2 hours') returning id into ord_id;
  insert into public.order_items (order_id, menu_item_id, quantity, price, subtotal) values
    (ord_id, i_spring_roll,     2, 120, 240),
    (ord_id, i_pbm,             1, 280, 280),
    (ord_id, i_roti,            2,  40,  80),
    (ord_id, i_chai,            2,  40,  80);
  sub := 620; tax := round(sub * 0.05, 2); tot := sub + tax;
  insert into public.bills (order_id, subtotal, tax, discount, total, payment_status, created_at)
    values (ord_id, sub, tax, 0, tot, 'paid', now() - interval '11 days') returning id into bill_id;
  insert into public.payments (bill_id, amount, method, created_at)
    values (bill_id, tot, 'cash', now() - interval '11 days');

  -- === ORDER 5: 9 days ago ===
  select id into tbl_id  from public.tables   where table_number = 3;
  select id into cust_id from public.customers where name = 'Ananya Iyer';
  insert into public.orders (table_id, customer_id, status, total_amount, created_at)
    values (tbl_id, cust_id, 'completed', 850, now() - interval '9 days') returning id into ord_id;
  insert into public.order_items (order_id, menu_item_id, quantity, price, subtotal) values
    (ord_id, i_aloo_tikki,     2, 100, 200),
    (ord_id, i_palak,          1, 250, 250),
    (ord_id, i_chicken_biryani,1, 320, 320),
    (ord_id, i_rasmalai,       1, 110, 110);
  sub := 850; tax := round(sub * 0.05, 2); tot := sub + tax;
  insert into public.bills (order_id, subtotal, tax, discount, total, payment_status, created_at)
    values (ord_id, sub, tax, 0, tot, 'paid', now() - interval '9 days') returning id into bill_id;
  insert into public.payments (bill_id, amount, method, transaction_id, created_at)
    values (bill_id, tot, 'upi', 'UPI9D005', now() - interval '9 days');

  -- === ORDER 6: 7 days ago ===
  select id into tbl_id  from public.tables   where table_number = 6;
  select id into cust_id from public.customers where name = 'Vikram Singh';
  insert into public.orders (table_id, customer_id, status, total_amount, created_at)
    values (tbl_id, cust_id, 'completed', 960, now() - interval '7 days') returning id into ord_id;
  insert into public.order_items (order_id, menu_item_id, quantity, price, subtotal) values
    (ord_id, i_chicken_tikka,  1, 240, 240),
    (ord_id, i_mutton_rj,      1, 380, 380),
    (ord_id, i_garlic_naan,    3,  60, 180),
    (ord_id, i_cold_coffee,    1, 110, 110),
    (ord_id, i_gulab,          1,  90,  90);
  sub := 960; tax := round(sub * 0.05, 2); tot := sub + tax;
  insert into public.bills (order_id, subtotal, tax, discount, total, payment_status, created_at)
    values (ord_id, sub, tax, 100, tot - 100, 'paid', now() - interval '7 days') returning id into bill_id;
  insert into public.payments (bill_id, amount, method, transaction_id, created_at)
    values (bill_id, tot - 100, 'card', 'CARD7D006', now() - interval '7 days');

  -- === ORDER 7: 6 days ago ===
  select id into tbl_id  from public.tables   where table_number = 2;
  select id into cust_id from public.customers where name = 'Divya Patel';
  insert into public.orders (table_id, customer_id, status, total_amount, created_at)
    values (tbl_id, cust_id, 'completed', 530, now() - interval '6 days') returning id into ord_id;
  insert into public.order_items (order_id, menu_item_id, quantity, price, subtotal) values
    (ord_id, i_spring_roll,    1, 120, 120),
    (ord_id, i_dal_makhani,    1, 220, 220),
    (ord_id, i_naan,           2,  50, 100),
    (ord_id, i_chai,           2,  40,  80);
  sub := 530; tax := round(sub * 0.05, 2); tot := sub + tax;
  insert into public.bills (order_id, subtotal, tax, discount, total, payment_status, created_at)
    values (ord_id, sub, tax, 0, tot, 'paid', now() - interval '6 days') returning id into bill_id;
  insert into public.payments (bill_id, amount, method, created_at)
    values (bill_id, tot, 'cash', now() - interval '6 days');

  -- === ORDER 8: 5 days ago ===
  select id into tbl_id  from public.tables   where table_number = 7;
  select id into cust_id from public.customers where name = 'Meera Krishnan';
  insert into public.orders (table_id, customer_id, status, total_amount, created_at)
    values (tbl_id, cust_id, 'completed', 1180, now() - interval '5 days') returning id into ord_id;
  insert into public.order_items (order_id, menu_item_id, quantity, price, subtotal) values
    (ord_id, i_paneer_tikka,    2, 180, 360),
    (ord_id, i_pbm,             1, 280, 280),
    (ord_id, i_veg_biryani,     1, 220, 220),
    (ord_id, i_lassi,           2,  90, 180),
    (ord_id, i_gulab,           1,  90,  90),
    (ord_id, i_water,           2,  30,  60);
  sub := 1180; tax := round(sub * 0.05, 2); tot := sub + tax;
  insert into public.bills (order_id, subtotal, tax, discount, total, payment_status, created_at)
    values (ord_id, sub, tax, 0, tot, 'paid', now() - interval '5 days') returning id into bill_id;
  insert into public.payments (bill_id, amount, method, transaction_id, created_at)
    values (bill_id, tot, 'upi', 'UPI5D008', now() - interval '5 days');

  -- === ORDER 9: 4 days ago ===
  select id into tbl_id  from public.tables   where table_number = 1;
  insert into public.orders (table_id, customer_id, status, total_amount, created_at)
    values (tbl_id, null, 'completed', 440, now() - interval '4 days') returning id into ord_id;
  insert into public.order_items (order_id, menu_item_id, quantity, price, subtotal) values
    (ord_id, i_aloo_tikki,     1, 100, 100),
    (ord_id, i_dal_makhani,    1, 220, 220),
    (ord_id, i_roti,           3,  40, 120);
  sub := 440; tax := round(sub * 0.05, 2); tot := sub + tax;
  insert into public.bills (order_id, subtotal, tax, discount, total, payment_status, created_at)
    values (ord_id, sub, tax, 0, tot, 'paid', now() - interval '4 days') returning id into bill_id;
  insert into public.payments (bill_id, amount, method, created_at)
    values (bill_id, tot, 'cash', now() - interval '4 days');

  -- === ORDER 10: 3 days ago ===
  select id into tbl_id  from public.tables   where table_number = 4;
  select id into cust_id from public.customers where name = 'Pooja Verma';
  insert into public.orders (table_id, customer_id, status, total_amount, created_at)
    values (tbl_id, cust_id, 'completed', 1560, now() - interval '3 days') returning id into ord_id;
  insert into public.order_items (order_id, menu_item_id, quantity, price, subtotal) values
    (ord_id, i_chicken_tikka,  2, 240, 480),
    (ord_id, i_mutton_rj,      1, 380, 380),
    (ord_id, i_chicken_biryani,1, 320, 320),
    (ord_id, i_garlic_naan,    2,  60, 120),
    (ord_id, i_rasmalai,       2, 110, 220),
    (ord_id, i_cold_coffee,    1, 110, 110),
    (ord_id, i_water,          1,  30,  30);
  sub := 1560; tax := round(sub * 0.05, 2); tot := sub + tax;
  insert into public.bills (order_id, subtotal, tax, discount, total, payment_status, created_at)
    values (ord_id, sub, tax, 200, tot - 200, 'paid', now() - interval '3 days') returning id into bill_id;
  insert into public.payments (bill_id, amount, method, transaction_id, created_at)
    values (bill_id, tot - 200, 'card', 'CARD3D010', now() - interval '3 days');

  -- === ORDER 11: Yesterday ===
  select id into tbl_id  from public.tables   where table_number = 8;
  select id into cust_id from public.customers where name = 'Fatima Shaikh';
  insert into public.orders (table_id, customer_id, status, total_amount, created_at)
    values (tbl_id, cust_id, 'completed', 680, now() - interval '1 day') returning id into ord_id;
  insert into public.order_items (order_id, menu_item_id, quantity, price, subtotal) values
    (ord_id, i_tom_soup,       1,  90,  90),
    (ord_id, i_pbm,            1, 280, 280),
    (ord_id, i_naan,           3,  50, 150),
    (ord_id, i_gulab,          1,  90,  90),
    (ord_id, i_chai,           2,  40,  80);
  sub := 680; tax := round(sub * 0.05, 2); tot := sub + tax;
  insert into public.bills (order_id, subtotal, tax, discount, total, payment_status, created_at)
    values (ord_id, sub, tax, 0, tot, 'paid', now() - interval '1 day') returning id into bill_id;
  insert into public.payments (bill_id, amount, method, transaction_id, created_at)
    values (bill_id, tot, 'upi', 'UPI1D011', now() - interval '1 day');

  -- === ORDER 12: Today (served, unpaid) ===
  select id into tbl_id  from public.tables   where table_number = 4;
  select id into cust_id from public.customers where name = 'Karan Mehta';
  insert into public.orders (table_id, customer_id, status, total_amount, created_at)
    values (tbl_id, cust_id, 'served', 920, now() - interval '1 hour') returning id into ord_id;
  insert into public.order_items (order_id, menu_item_id, quantity, price, subtotal) values
    (ord_id, i_chicken_tikka,  1, 240, 240),
    (ord_id, i_chicken_curry,  1, 300, 300),
    (ord_id, i_garlic_naan,    2,  60, 120),
    (ord_id, i_cold_coffee,    2, 110, 220),
    (ord_id, i_water,          1,  30,  30);

  -- === ORDER 13: Today (preparing) ===
  select id into tbl_id  from public.tables   where table_number = 7;
  select id into cust_id from public.customers where name = 'Naveen Rao';
  insert into public.orders (table_id, customer_id, status, total_amount, created_at)
    values (tbl_id, cust_id, 'preparing', 540, now() - interval '25 minutes') returning id into ord_id;
  insert into public.order_items (order_id, menu_item_id, quantity, price, subtotal) values
    (ord_id, i_paneer_tikka,  1, 180, 180),
    (ord_id, i_dal_makhani,   1, 220, 220),
    (ord_id, i_naan,          2,  50, 100),
    (ord_id, i_chai,          1,  40,  40);

  -- === ORDER 14: Today (pending) ===
  select id into tbl_id  from public.tables   where table_number = 2;
  insert into public.orders (table_id, customer_id, status, total_amount, created_at)
    values (tbl_id, null, 'pending', 350, now() - interval '5 minutes') returning id into ord_id;
  insert into public.order_items (order_id, menu_item_id, quantity, price, subtotal) values
    (ord_id, i_spring_roll,   2, 120, 240),
    (ord_id, i_lassi,         1,  90,  90),
    (ord_id, i_water,         1,  30,  30);

end $$;

-- ── 10. Notifications ─────────────────────────────────────────
insert into public.notifications (role, title, body) values
  ('kitchen',  'New Order – Table 2',   'Order #14 has been placed. 3 items to prepare.'),
  ('kitchen',  'Order Update',           'Order #13 items are ready to serve.'),
  ('cashier',  'Payment Pending',        'Table 4 order is served and awaiting payment.'),
  ('manager',  'Low Stock Alert',        'Milk is running low (12 litre < threshold 15).'),
  ('manager',  'Low Stock Alert',        'Saffron stock is critically low.'),
  ('admin',    'System Ready',           'Seed data loaded. Spice Table is ready for demo.'),
  ('waiter',   'Table 3 Reserved',       'Reservation confirmed for Arjun Sharma tomorrow.'),
  (null,       'Welcome to Spice Table', 'The restaurant management system is now live!');
