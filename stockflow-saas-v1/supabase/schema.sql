
-- Inventory
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  sku text,
  name text not null,
  unit text default 'pcs',
  cost numeric default 0,
  price numeric default 0,
  min_threshold int default 0,
  created_at timestamptz default now()
);

create table if not exists movements (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('IN','OUT','ADJUST')) not null,
  product_id uuid references products(id) on delete cascade,
  qty numeric not null,
  note text,
  created_at timestamptz default now()
);

-- Stock view (materialized approach omitted for PoC)
create or replace view stock_balance as
select p.id as product_id, p.sku, p.name, coalesce(sum(case when m.type='IN' then m.qty when m.type='OUT' then -m.qty when m.type='ADJUST' then m.qty else 0 end),0) as total
from products p
left join movements m on m.product_id = p.id
group by p.id, p.sku, p.name;

-- Low stock alerts
create or replace function low_stock_alerts()
returns table(product_id uuid, name text, total numeric, min_threshold int)
language sql stable as $$
  select p.id, p.name, coalesce(sb.total,0) as total, p.min_threshold
  from products p
  left join stock_balance sb on sb.product_id = p.id
  where p.min_threshold > 0 and coalesce(sb.total,0) < p.min_threshold
$$;

-- Forms
create table if not exists form_templates (
  id uuid primary key,
  name text not null,
  slug text unique not null,
  version int not null default 1,
  schema jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists form_instances (
  id uuid primary key,
  template_id uuid references form_templates(id) on delete cascade,
  status text not null default 'SUBMITTED',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Security (RLS)
alter table products enable row level security;
alter table movements enable row level security;
alter table form_templates enable row level security;
alter table form_instances enable row level security;

-- Basic policies for PoC (open read, allow inserts; tighten later)
create policy "read products" on products for select using (true);
create policy "insert products" on products for insert with check (true);
create policy "read movements" on movements for select using (true);
create policy "insert movements" on movements for insert with check (true);

create policy "read templates" on form_templates for select using (true);
create policy "insert templates" on form_templates for insert with check (true);
create policy "update templates" on form_templates for update using (true);

create policy "read instances" on form_instances for select using (true);
create policy "insert instances" on form_instances for insert with check (true);
create policy "update instances" on form_instances for update using (true);
