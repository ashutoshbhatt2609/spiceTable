# Deployment Guide

## Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in SQL Editor.
3. Create the first admin user in Supabase Auth.
4. Insert the matching `profiles` row:

```sql
insert into public.profiles (id, name, email, role)
values ('AUTH_USER_UUID', 'Admin', 'admin@example.com', 'admin');
```

## Vercel

1. Push the project to GitHub.
2. Import it into Vercel.
3. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL`
4. Deploy.

## QR Ordering

QR URLs use this format:

```text
https://your-domain.com/order/table-5
```

Generate one QR code per table and print it for table ordering.
