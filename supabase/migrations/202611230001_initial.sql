create extension if not exists pgcrypto;

do $$ begin
  create type public.container_type as enum ('plain', 'fabricated', 'refrigerated');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.container_status as enum ('draft', 'available', 'reserved', 'sold', 'archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.media_kind as enum ('image', 'video');
exception when duplicate_object then null;
end $$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('owner', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.containers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  short_name text not null,
  type public.container_type not null,
  size text not null check (size in ('20ft', '40ft', '40ft-hc')),
  condition text not null check (condition in ('new', 'used')),
  condition_label text,
  grade text,
  price integer not null check (price >= 0),
  description text not null default '',
  highlights text[] not null default '{}',
  specs jsonb not null default '{}'::jsonb,
  condition_notes text[] not null default '{}',
  included text[] not null default '{}',
  features text[] not null default '{}',
  best_for text[] not null default '{}',
  photos_are_representative boolean not null default false,
  featured boolean not null default false,
  status public.container_status not null default 'draft',
  stock integer not null default 0 check (stock >= 0),
  year integer,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.container_media (
  id uuid primary key default gen_random_uuid(),
  container_id uuid not null references public.containers(id) on delete cascade,
  kind public.media_kind not null default 'image',
  src text not null,
  storage_path text,
  alt text not null,
  poster text,
  poster_path text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists container_media_container_position_idx
  on public.container_media (container_id, position);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text,
  email text,
  message text,
  container_id uuid references public.containers(id) on delete set null,
  interest text,
  source text,
  page_path text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'quoted', 'won', 'lost', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_status_created_idx
  on public.leads (status, created_at desc);

create index if not exists containers_status_published_idx
  on public.containers (status, published_at desc);

create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  table_name text not null,
  record_id uuid,
  action text not null,
  actor_id uuid,
  changes jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and role = 'owner'
  );
$$;

grant execute on function public.is_owner() to authenticated;

create or replace function public.set_actor()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    new.created_by = auth.uid();
  end if;
  new.updated_by = auth.uid();
  return new;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists containers_set_actor on public.containers;
create trigger containers_set_actor
before insert or update on public.containers
for each row execute function public.set_actor();

drop trigger if exists containers_set_updated_at on public.containers;
create trigger containers_set_updated_at
before update on public.containers
for each row execute function public.set_updated_at();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

create or replace function public.log_audit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_log (table_name, record_id, action, actor_id, changes)
  values (
    tg_table_name,
    case when tg_op = 'DELETE' then old.id else new.id end,
    tg_op,
    auth.uid(),
    case
      when tg_op = 'DELETE' then jsonb_build_object('old', to_jsonb(old))
      when tg_op = 'INSERT' then jsonb_build_object('new', to_jsonb(new))
      else jsonb_build_object('old', to_jsonb(old), 'new', to_jsonb(new))
    end
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists containers_audit on public.containers;
create trigger containers_audit
after insert or update or delete on public.containers
for each row execute function public.log_audit();

drop trigger if exists leads_audit on public.leads;
create trigger leads_audit
after insert or update or delete on public.leads
for each row execute function public.log_audit();

alter table public.admin_users enable row level security;
alter table public.containers enable row level security;
alter table public.container_media enable row level security;
alter table public.leads enable row level security;
alter table public.audit_log enable row level security;

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users for select
to authenticated
using (public.is_admin());

drop policy if exists "Owners can manage admin users" on public.admin_users;
create policy "Owners can manage admin users"
on public.admin_users for all
to authenticated
using (public.is_owner())
with check (public.is_owner());

drop policy if exists "Public can read published containers" on public.containers;
create policy "Public can read published containers"
on public.containers for select
to anon, authenticated
using (status in ('available', 'reserved', 'sold'));

drop policy if exists "Admins can manage containers" on public.containers;
create policy "Admins can manage containers"
on public.containers for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read media for published containers" on public.container_media;
create policy "Public can read media for published containers"
on public.container_media for select
to anon, authenticated
using (
  exists (
    select 1 from public.containers
    where containers.id = container_media.container_id
      and containers.status in ('available', 'reserved', 'sold')
  )
);

drop policy if exists "Admins can manage container media" on public.container_media;
create policy "Admins can manage container media"
on public.container_media for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read leads" on public.leads;
create policy "Admins can read leads"
on public.leads for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update leads" on public.leads;
create policy "Admins can update leads"
on public.leads for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read audit log" on public.audit_log;
create policy "Admins can read audit log"
on public.audit_log for select
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'container-media',
  'container-media',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read container media objects" on storage.objects;
create policy "Public can read container media objects"
on storage.objects for select
to public
using (bucket_id = 'container-media');

drop policy if exists "Admins can upload container media objects" on storage.objects;
create policy "Admins can upload container media objects"
on storage.objects for insert
to authenticated
with check (bucket_id = 'container-media' and public.is_admin());

drop policy if exists "Admins can update container media objects" on storage.objects;
create policy "Admins can update container media objects"
on storage.objects for update
to authenticated
using (bucket_id = 'container-media' and public.is_admin())
with check (bucket_id = 'container-media' and public.is_admin());

drop policy if exists "Admins can delete container media objects" on storage.objects;
create policy "Admins can delete container media objects"
on storage.objects for delete
to authenticated
using (bucket_id = 'container-media' and public.is_admin());

-- Bootstrap the first owner after creating the account in Supabase Auth:
-- insert into public.admin_users (user_id, role)
-- values ('<auth-user-uuid>', 'owner');
