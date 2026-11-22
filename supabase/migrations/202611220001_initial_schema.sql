create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  currency text not null default 'PHP' check (currency = 'PHP'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 60),
  type text not null check (type in ('income', 'expense')),
  icon text not null default 'wallet',
  created_at timestamptz not null default now(),
  unique (user_id, name, type)
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.categories(id),
  type text not null check (type in ('income', 'expense')),
  amount integer not null check (amount > 0),
  description text not null check (length(trim(description)) between 1 and 200),
  transaction_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.categories(id),
  month date not null check (extract(day from month) = 1),
  amount integer not null check (amount > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, category_id, month)
);

create table public.recurring_bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.categories(id),
  name text not null check (length(trim(name)) between 1 and 120),
  amount integer not null check (amount > 0),
  frequency text not null check (frequency in ('weekly','monthly','quarterly','yearly')),
  next_due_date date not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.ai_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period_start date not null,
  prompt text not null check (length(prompt) between 1 and 1000),
  response text not null check (length(response) between 1 and 8000),
  created_at timestamptz not null default now()
);

create index transactions_user_date_idx on public.transactions(user_id, transaction_date desc);
create index budgets_user_month_idx on public.budgets(user_id, month);
create index bills_user_due_idx on public.recurring_bills(user_id, next_due_date) where active;
create index insights_user_created_idx on public.ai_insights(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.recurring_bills enable row level security;
alter table public.ai_insights enable row level security;

create policy "profiles own row" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "read shared or own categories" on public.categories for select using (user_id is null or auth.uid() = user_id);
create policy "manage own categories" on public.categories for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "transactions own rows" on public.transactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "budgets own rows" on public.budgets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "bills own rows" on public.recurring_bills for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "insights own rows" on public.ai_insights for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create function public.check_category_owner() returns trigger language plpgsql set search_path = '' as $$
declare
  expected_type text;
begin
  expected_type := case when tg_table_name = 'transactions' then new.type else 'expense' end;
  if not exists (select 1 from public.categories c where c.id = new.category_id and c.type = expected_type and (c.user_id is null or c.user_id = new.user_id)) then
    raise exception 'category is not available to this user';
  end if;
  return new;
end;
$$;
create trigger transactions_category_owner before insert or update of category_id, user_id on public.transactions for each row execute function public.check_category_owner();
create trigger budgets_category_owner before insert or update of category_id, user_id on public.budgets for each row execute function public.check_category_owner();
create trigger bills_category_owner before insert or update of category_id, user_id on public.recurring_bills for each row execute function public.check_category_owner();

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

insert into public.categories (id, user_id, name, type, icon) values
('10000000-0000-4000-8000-000000000001', null, 'Housing', 'expense', 'home'),
('10000000-0000-4000-8000-000000000002', null, 'Food & Groceries', 'expense', 'utensils'),
('10000000-0000-4000-8000-000000000003', null, 'Transport', 'expense', 'car'),
('10000000-0000-4000-8000-000000000004', null, 'Utilities & Bills', 'expense', 'zap'),
('10000000-0000-4000-8000-000000000005', null, 'Health', 'expense', 'heart-pulse'),
('10000000-0000-4000-8000-000000000006', null, 'Entertainment', 'expense', 'clapperboard'),
('10000000-0000-4000-8000-000000000007', null, 'Shopping', 'expense', 'shopping-bag'),
('10000000-0000-4000-8000-000000000008', null, 'Family Support', 'expense', 'users'),
('10000000-0000-4000-8000-000000000009', null, 'Salary', 'income', 'briefcase'),
('10000000-0000-4000-8000-000000000010', null, 'Freelance', 'income', 'laptop');
