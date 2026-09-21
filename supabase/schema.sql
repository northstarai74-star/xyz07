-- Ghar & Co order storage.
-- Run in the Supabase dashboard: SQL Editor > New query > Run.
-- Safe to re-run: every statement is guarded.

create table if not exists public.orders (
  id           text primary key,
  created_at   timestamptz not null default now(),
  customer_id  uuid        references auth.users on delete set null,
  lines        jsonb       not null,
  address      jsonb       not null,
  delivery     text        not null,
  payment      text        not null,
  subtotal     integer     not null,
  delivery_fee integer     not null,
  total        integer     not null
);

-- For anyone who ran the first version of this file, before accounts existed.
alter table public.orders
  add column if not exists customer_id uuid references auth.users on delete set null;

create index if not exists orders_customer_id_idx on public.orders (customer_id);

alter table public.orders enable row level security;

drop policy if exists "anyone can place an order" on public.orders;
drop policy if exists "customers read their own orders" on public.orders;

-- Guests can still check out without an account. The check stops a signed-in
-- visitor from filing an order under somebody else's customer_id.
create policy "anyone can place an order"
  on public.orders for insert
  to anon, authenticated
  with check (customer_id is null or customer_id = auth.uid());

-- Reading is granted only for your own orders. Order IDs are guessable
-- (GC + a base36 timestamp), so a blanket select policy would let anyone
-- enumerate other customers' names, phone numbers and addresses.
-- Guest orders have a null customer_id and so match no one: the confirmation
-- page reads those from its localStorage cache instead.
create policy "customers read their own orders"
  on public.orders for select
  to authenticated
  using (customer_id = auth.uid());

-- Orders are a record of what was agreed, so nobody may edit or delete one
-- through the API. No update or delete policy is defined, and with RLS on
-- that means those operations are refused for every client.
