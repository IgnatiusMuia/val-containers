-- Admin CMS, inventory verification, enquiries, content and access control.
-- Additive migration: existing tables and data are preserved.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Admin users and permissions
-- ---------------------------------------------------------------------------

alter table public.admin_users
  add column if not exists display_name text,
  add column if not exists active boolean not null default true,
  add column if not exists permissions text[] not null default '{}'::text[],
  add column if not exists invited_at timestamptz,
  add column if not exists accepted_at timestamptz,
  add column if not exists last_seen_at timestamptz;

alter table public.admin_users
  drop constraint if exists admin_users_permissions_valid;

alter table public.admin_users
  add constraint admin_users_permissions_valid
  check (permissions <@ array['inventory', 'media', 'enquiries', 'content']::text[]);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and active
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
    where user_id = auth.uid() and role = 'owner' and active
  );
$$;

grant execute on function public.is_owner() to authenticated;

create or replace function public.has_permission(permission text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
      and active
      and (
        role = 'owner'
        or permission = any(permissions)
      )
  );
$$;

grant execute on function public.has_permission(text) to authenticated;

-- ---------------------------------------------------------------------------
-- Container inventory enhancements
-- ---------------------------------------------------------------------------

alter table public.containers
  add column if not exists reference text,
  add column if not exists publication_status text not null default 'draft'
    check (publication_status in ('draft', 'published', 'archived')),
  add column if not exists currency text not null default 'KES'
    check (currency ~ '^[A-Z]{3}$'),
  add column if not exists location text not null default 'Nairobi yard',
  add column if not exists delivery_info text not null default '',
  add column if not exists refrigeration_status text not null default 'not_applicable'
    check (refrigeration_status in ('not_applicable', 'unverified', 'working', 'needs_service')),
  add column if not exists last_inspected_at date,
  add column if not exists verified_at timestamptz,
  add column if not exists verified_by uuid references auth.users(id) on delete set null;

alter table public.container_media
  add column if not exists is_cover boolean not null default false;

create or replace function public.set_container_reference()
returns trigger
language plpgsql
as $$
begin
  if new.reference is null or btrim(new.reference) = '' then
    new.reference := 'VC-' || upper(substr(replace(new.id::text, '-', ''), 1, 8));
  end if;
  return new;
end;
$$;

drop trigger if exists containers_set_reference on public.containers;
create trigger containers_set_reference
before insert on public.containers
for each row execute function public.set_container_reference();

update public.containers
set reference = 'VC-' || upper(substr(replace(id::text, '-', ''), 1, 8))
where reference is null;

alter table public.containers alter column reference set not null;

create unique index if not exists containers_reference_key
  on public.containers (reference);

update public.containers
set publication_status = case
  when status in ('available', 'reserved', 'sold') then 'published'
  when status = 'archived' then 'archived'
  else 'draft'
end
where publication_status = 'draft';

update public.containers
set refrigeration_status = case
  when type = 'refrigerated' then 'unverified'
  else 'not_applicable'
end
where type = 'refrigerated' and refrigeration_status = 'not_applicable';

update public.container_media as media
set is_cover = true
where media.id in (
  select distinct on (container_id) id
  from public.container_media
  where kind = 'image'
  order by container_id, position asc, created_at asc
)
and not exists (
  select 1 from public.container_media cover
  where cover.container_id = media.container_id and cover.is_cover
);

create unique index if not exists container_media_one_cover_idx
  on public.container_media (container_id)
  where is_cover;

-- ---------------------------------------------------------------------------
-- Enquiries
-- ---------------------------------------------------------------------------

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  customer_name text not null,
  phone text not null,
  email text,
  company text,
  preferred_contact text not null default 'whatsapp'
    check (preferred_contact in ('whatsapp', 'phone', 'email')),
  container_id uuid references public.containers(id) on delete set null,
  container_name text,
  container_slug text,
  container_reference text,
  container_type text,
  container_size text,
  condition_preference text,
  quantity integer check (quantity is null or quantity > 0),
  delivery_location text,
  delivery_county text,
  timeline text,
  use_case text,
  message text,
  source text not null default 'website',
  page_path text,
  user_agent text,
  status text not null default 'new'
    check (status in (
      'new',
      'under_review',
      'contacted',
      'awaiting_customer',
      'quotation_discussed',
      'negotiation',
      'converted',
      'closed',
      'cancelled'
    )),
  assigned_to uuid references auth.users(id) on delete set null,
  follow_up_at date,
  quotation_total numeric(12, 2) check (quotation_total is null or quotation_total >= 0),
  converted_value numeric(12, 2) check (converted_value is null or converted_value >= 0),
  closed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists enquiries_status_created_idx
  on public.enquiries (status, created_at desc);

create index if not exists enquiries_created_idx
  on public.enquiries (created_at desc);

create index if not exists enquiries_phone_idx
  on public.enquiries (phone);

create or replace function public.set_enquiry_reference()
returns trigger
language plpgsql
as $$
begin
  if new.reference is null or btrim(new.reference) = '' then
    new.reference := 'VC-E-' || to_char(now(), 'YYMMDD') || '-' ||
      upper(substr(replace(new.id::text, '-', ''), 1, 6));
  end if;
  return new;
end;
$$;

drop trigger if exists enquiries_set_reference on public.enquiries;
create trigger enquiries_set_reference
before insert on public.enquiries
for each row execute function public.set_enquiry_reference();

drop trigger if exists enquiries_set_updated_at on public.enquiries;
create trigger enquiries_set_updated_at
before update on public.enquiries
for each row execute function public.set_updated_at();

create table if not exists public.enquiry_attachments (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  file_size integer not null check (file_size > 0),
  created_at timestamptz not null default now()
);

create index if not exists enquiry_attachments_enquiry_idx
  on public.enquiry_attachments (enquiry_id, created_at);

create table if not exists public.enquiry_notes (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  body text not null check (char_length(btrim(body)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists enquiry_notes_enquiry_idx
  on public.enquiry_notes (enquiry_id, created_at desc);

create table if not exists public.enquiry_quotations (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  reference text not null unique,
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'KES' check (currency ~ '^[A-Z]{3}$'),
  delivery_included boolean not null default false,
  valid_until date,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists enquiry_quotations_enquiry_idx
  on public.enquiry_quotations (enquiry_id, created_at desc);

create or replace function public.set_quotation_reference()
returns trigger
language plpgsql
as $$
begin
  if new.reference is null or btrim(new.reference) = '' then
    new.reference := 'VC-Q-' || to_char(now(), 'YYMMDD') || '-' ||
      upper(substr(replace(new.id::text, '-', ''), 1, 6));
  end if;
  return new;
end;
$$;

drop trigger if exists quotations_set_reference on public.enquiry_quotations;
create trigger quotations_set_reference
before insert on public.enquiry_quotations
for each row execute function public.set_quotation_reference();

create table if not exists public.enquiry_activity (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists enquiry_activity_enquiry_idx
  on public.enquiry_activity (enquiry_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Content, FAQs, gallery and announcements
-- ---------------------------------------------------------------------------

create table if not exists public.site_content (
  key text primary key check (key ~ '^[a-z0-9._-]+$'),
  page text not null check (page in ('home', 'about', 'delivery', 'contact', 'global')),
  label text not null,
  type text not null default 'text' check (type in ('text', 'textarea')),
  value text not null default '',
  position integer not null default 0,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.site_content_drafts (
  key text primary key references public.site_content(key) on delete cascade,
  value text not null default '',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'general',
  position integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  caption text not null default '',
  src text not null,
  storage_path text,
  alt text not null,
  position integer not null default 0,
  publication_status text not null default 'published'
    check (publication_status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  link_label text,
  link_href text,
  active boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  site_name text not null default 'Val Containers',
  tagline text not null default '',
  description text not null default '',
  email text not null default 'Vallsia35@gmail.com',
  phone_display text not null default '+254 795 506 397',
  phone_href text not null default 'tel:+254795506397',
  whatsapp_number text not null default '254795506397',
  address_line text not null default 'Near NTSA Inspection Centre, Likoni Road',
  address text not null default 'MVQ6+VHV, Nairobi, Kenya',
  city text not null default 'Nairobi',
  maps_url text not null default 'https://maps.google.com/?q=MVQ6+VHV+Nairobi+Kenya',
  maps_embed text not null default 'https://maps.google.com/maps?q=MVQ6%2BVHV%20Nairobi%20Kenya&z=16&output=embed',
  hours text not null default 'Call to confirm current yard hours',
  hours_short text not null default 'Nairobi yard',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Login rate limiting
-- ---------------------------------------------------------------------------

create table if not exists public.auth_rate_limits (
  key text primary key,
  attempt_count integer not null default 0,
  window_started_at timestamptz not null default now(),
  blocked_until timestamptz,
  updated_at timestamptz not null default now()
);

create or replace function public.consume_auth_attempt(
  p_key text,
  p_limit integer,
  p_window_seconds integer,
  p_block_seconds integer
)
returns table (allowed boolean, retry_after integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_row public.auth_rate_limits%rowtype;
begin
  insert into public.auth_rate_limits (key, attempt_count, window_started_at)
  values (p_key, 0, v_now)
  on conflict (key) do nothing;

  select * into v_row
  from public.auth_rate_limits
  where key = p_key
  for update;

  if v_row.blocked_until is not null and v_row.blocked_until > v_now then
    return query select false, greatest(1, ceil(extract(epoch from (v_row.blocked_until - v_now)))::integer);
    return;
  end if;

  if v_row.window_started_at < v_now - make_interval(secs => p_window_seconds) then
    v_row.attempt_count := 0;
    v_row.window_started_at := v_now;
    v_row.blocked_until := null;
  end if;

  v_row.attempt_count := v_row.attempt_count + 1;

  if v_row.attempt_count > p_limit then
    v_row.blocked_until := v_now + make_interval(secs => p_block_seconds);
    update public.auth_rate_limits
    set attempt_count = v_row.attempt_count,
        window_started_at = v_row.window_started_at,
        blocked_until = v_row.blocked_until,
        updated_at = v_now
    where key = p_key;

    return query select false, p_block_seconds;
    return;
  end if;

  update public.auth_rate_limits
  set attempt_count = v_row.attempt_count,
      window_started_at = v_row.window_started_at,
      blocked_until = null,
      updated_at = v_now
  where key = p_key;

  return query select true, 0;
end;
$$;

revoke all on function public.consume_auth_attempt(text, integer, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_auth_attempt(text, integer, integer, integer) to service_role;

-- ---------------------------------------------------------------------------
-- Updated-at and audit triggers
-- ---------------------------------------------------------------------------

drop trigger if exists faqs_set_updated_at on public.faqs;
create trigger faqs_set_updated_at
before update on public.faqs
for each row execute function public.set_updated_at();

drop trigger if exists gallery_set_updated_at on public.gallery_items;
create trigger gallery_set_updated_at
before update on public.gallery_items
for each row execute function public.set_updated_at();

drop trigger if exists announcements_set_updated_at on public.announcements;
create trigger announcements_set_updated_at
before update on public.announcements
for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();

drop trigger if exists container_media_audit on public.container_media;
create trigger container_media_audit
after insert or update or delete on public.container_media
for each row execute function public.log_audit();

drop trigger if exists enquiries_audit on public.enquiries;
create trigger enquiries_audit
after insert or update or delete on public.enquiries
for each row execute function public.log_audit();

drop trigger if exists enquiry_notes_audit on public.enquiry_notes;
create trigger enquiry_notes_audit
after insert or update or delete on public.enquiry_notes
for each row execute function public.log_audit();

drop trigger if exists enquiry_quotations_audit on public.enquiry_quotations;
create trigger enquiry_quotations_audit
after insert or update or delete on public.enquiry_quotations
for each row execute function public.log_audit();

drop trigger if exists faqs_audit on public.faqs;
create trigger faqs_audit
after insert or update or delete on public.faqs
for each row execute function public.log_audit();

drop trigger if exists gallery_audit on public.gallery_items;
create trigger gallery_audit
after insert or update or delete on public.gallery_items
for each row execute function public.log_audit();

drop trigger if exists announcements_audit on public.announcements;
create trigger announcements_audit
after insert or update or delete on public.announcements
for each row execute function public.log_audit();

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------

alter table public.enquiries enable row level security;
alter table public.enquiry_attachments enable row level security;
alter table public.enquiry_notes enable row level security;
alter table public.enquiry_quotations enable row level security;
alter table public.enquiry_activity enable row level security;
alter table public.site_content enable row level security;
alter table public.site_content_drafts enable row level security;
alter table public.faqs enable row level security;
alter table public.gallery_items enable row level security;
alter table public.announcements enable row level security;
alter table public.site_settings enable row level security;
alter table public.auth_rate_limits enable row level security;

drop policy if exists "Public can read published containers" on public.containers;
create policy "Public can read published containers"
on public.containers for select
to anon, authenticated
using (
  publication_status = 'published'
  and status in ('available', 'reserved')
);

drop policy if exists "Public can read media for published containers" on public.container_media;
create policy "Public can read media for published containers"
on public.container_media for select
to anon, authenticated
using (
  exists (
    select 1 from public.containers
    where containers.id = container_media.container_id
      and containers.publication_status = 'published'
      and containers.status in ('available', 'reserved')
  )
);

drop policy if exists "Admins can read enquiries" on public.enquiries;
create policy "Admins can read enquiries"
on public.enquiries for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update enquiries" on public.enquiries;
create policy "Admins can update enquiries"
on public.enquiries for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can insert enquiries" on public.enquiries;
create policy "Admins can insert enquiries"
on public.enquiries for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins manage enquiry attachments" on public.enquiry_attachments;
create policy "Admins manage enquiry attachments"
on public.enquiry_attachments for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage enquiry notes" on public.enquiry_notes;
create policy "Admins manage enquiry notes"
on public.enquiry_notes for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage enquiry quotations" on public.enquiry_quotations;
create policy "Admins manage enquiry quotations"
on public.enquiry_quotations for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins read enquiry activity" on public.enquiry_activity;
create policy "Admins read enquiry activity"
on public.enquiry_activity for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins write enquiry activity" on public.enquiry_activity;
create policy "Admins write enquiry activity"
on public.enquiry_activity for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
on public.site_content for select
to anon, authenticated
using (true);

drop policy if exists "Admins manage site content" on public.site_content;
create policy "Admins manage site content"
on public.site_content for all
to authenticated
using (public.has_permission('content'))
with check (public.has_permission('content'));

drop policy if exists "Admins manage content drafts" on public.site_content_drafts;
create policy "Admins manage content drafts"
on public.site_content_drafts for all
to authenticated
using (public.has_permission('content'))
with check (public.has_permission('content'));

drop policy if exists "Public can read active FAQs" on public.faqs;
create policy "Public can read active FAQs"
on public.faqs for select
to anon, authenticated
using (active);

drop policy if exists "Admins manage FAQs" on public.faqs;
create policy "Admins manage FAQs"
on public.faqs for all
to authenticated
using (public.has_permission('content'))
with check (public.has_permission('content'));

drop policy if exists "Public can read published gallery" on public.gallery_items;
create policy "Public can read published gallery"
on public.gallery_items for select
to anon, authenticated
using (publication_status = 'published');

drop policy if exists "Admins manage gallery" on public.gallery_items;
create policy "Admins manage gallery"
on public.gallery_items for all
to authenticated
using (public.has_permission('content'))
with check (public.has_permission('content'));

drop policy if exists "Public can read current announcements" on public.announcements;
create policy "Public can read current announcements"
on public.announcements for select
to anon, authenticated
using (
  active
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
);

drop policy if exists "Admins manage announcements" on public.announcements;
create policy "Admins manage announcements"
on public.announcements for all
to authenticated
using (public.has_permission('content'))
with check (public.has_permission('content'));

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings for select
to anon, authenticated
using (true);

drop policy if exists "Owners update site settings" on public.site_settings;
create policy "Owners update site settings"
on public.site_settings for update
to authenticated
using (public.is_owner())
with check (public.is_owner());

-- Existing owners need every permission flag for display purposes.
update public.admin_users
set permissions = array['inventory', 'media', 'enquiries', 'content']::text[]
where role = 'owner' and permissions = '{}'::text[];

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'enquiry-media',
  'enquiry-media',
  false,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can read enquiry media objects" on storage.objects;
create policy "Admins can read enquiry media objects"
on storage.objects for select
to authenticated
using (bucket_id = 'enquiry-media' and public.is_admin());

drop policy if exists "Admins can upload enquiry media objects" on storage.objects;
create policy "Admins can upload enquiry media objects"
on storage.objects for insert
to authenticated
with check (bucket_id = 'enquiry-media' and public.is_admin());

drop policy if exists "Admins can delete enquiry media objects" on storage.objects;
create policy "Admins can delete enquiry media objects"
on storage.objects for delete
to authenticated
using (bucket_id = 'enquiry-media' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Seed editable content
-- ---------------------------------------------------------------------------

insert into public.site_content (key, page, label, type, value, position)
values
  ('home.hero.eyebrow', 'home', 'Hero eyebrow', 'text', 'Nairobi yard · Countrywide delivery', 10),
  ('home.hero.title', 'home', 'Hero headline', 'text', 'Every container has', 20),
  ('home.hero.accent', 'home', 'Hero accent line', 'text', 'a paper trail.', 30),
  ('home.hero.body', 'home', 'Hero body', 'textarea', 'Plain, fabricated and refrigerated containers with published prices, condition notes and the documents available for the exact unit. Inspect before you pay, or ask for current photos and video.', 40),
  ('home.hero.primary_cta', 'home', 'Hero primary button', 'text', 'Browse the fleet', 50),
  ('home.hero.secondary_cta', 'home', 'Hero secondary button', 'text', 'Get a free quote', 60),
  ('home.fleet.eyebrow', 'home', 'Fleet eyebrow', 'text', 'The fleet', 70),
  ('home.fleet.title', 'home', 'Fleet headline', 'text', 'Stock you can inspect, price and take home.', 80),
  ('home.fleet.body', 'home', 'Fleet body', 'textarea', 'A working selection from the yard. Every listing has a published price and condition notes. Ask for current photos, the serial and the inspection sheet for the exact unit before you pay.', 90),
  ('home.why.eyebrow', 'home', 'Why Val eyebrow', 'text', 'Why Val', 100),
  ('home.why.title', 'home', 'Why Val headline', 'text', 'The details other yards skip.', 110),
  ('home.why.body', 'home', 'Why Val body', 'textarea', 'A container is a simple product. The difference is what comes with it: current photos, clear condition notes and a delivery plan that survives the gate.', 120),
  ('home.why.quote', 'home', 'Yard rule quote', 'textarea', 'If a unit is not right for the job, we will say so before you pay.', 130),
  ('home.gallery.eyebrow', 'home', 'Gallery eyebrow', 'text', 'From the yard', 140),
  ('home.gallery.title', 'home', 'Gallery headline', 'text', 'Yard examples, not stock photos.', 150),
  ('home.gallery.body', 'home', 'Gallery body', 'textarea', 'A look at units and fit-outs from the yard. Ask for current photos and the inspection sheet for the exact container you are considering.', 160),
  ('home.faq.eyebrow', 'home', 'FAQ eyebrow', 'text', 'FAQ', 170),
  ('home.faq.title', 'home', 'FAQ headline', 'text', 'Questions, answered.', 180),
  ('home.faq.body', 'home', 'FAQ body', 'textarea', 'The things buyers ask before they send money. If yours is not here, WhatsApp us — a person at the yard will reply.', 190),
  ('about.hero.eyebrow', 'about', 'About hero eyebrow', 'text', 'Val Containers · Nairobi', 10),
  ('about.hero.title', 'about', 'About hero headline', 'text', 'The yard is the showroom.', 20),
  ('about.hero.body', 'about', 'About hero body', 'textarea', 'We are a Nairobi container yard that sells the way we would want to buy: clear prices, honest listings and a person who answers the phone. No imported mystique, no surprise invoices.', 30),
  ('about.story.title', 'about', 'Story headline', 'text', 'Containers are simple. Buying one shouldn’t be.', 40),
  ('about.story.body_1', 'about', 'Story paragraph one', 'textarea', 'Most container listings in Kenya tell you a size, a price and very little else. Photos are recycled, grades are vague, and the delivery number arrives after you have committed. Buyers are left to inspect a unit they cannot see, from a seller they have never met.', 50),
  ('about.story.body_2', 'about', 'Story paragraph two', 'textarea', 'Val runs the other way. We photograph the yard examples, state the grade and write the condition notes down. For the exact unit, we share current photos and serial details before payment. The yard is open for inspection because the best way to buy steel is to stand next to it.', 60),
  ('about.story.body_3', 'about', 'Story paragraph three', 'textarea', 'We are not the cheapest yard in Nairobi. We are the one that tells you what you are buying, what it will take to deliver it and what to check before you sign.', 70),
  ('about.rule.text', 'about', 'Yard rule', 'textarea', 'Ask for current photos, the serial and the inspection sheet for the exact unit before you pay.', 80),
  ('about.rule.note', 'about', 'Yard rule note', 'text', 'The yard rule', 90),
  ('delivery.hero.eyebrow', 'delivery', 'Delivery hero eyebrow', 'text', 'Countrywide · Written quotes', 10),
  ('delivery.hero.title', 'delivery', 'Delivery hero headline', 'text', 'Quoted to the gate. Not to the yard.', 20),
  ('delivery.hero.body', 'delivery', 'Delivery hero body', 'textarea', 'We deliver from our Nairobi yard across Kenya. You get one written figure for the truck, crane and offload — before the unit moves.', 30),
  ('delivery.coverage.title', 'delivery', 'Coverage headline', 'text', 'Where the truck goes.', 40),
  ('delivery.coverage.body', 'delivery', 'Coverage note', 'textarea', 'Coverage and the final delivery cost are confirmed after the site access check. No fixed delivery price is published until it has been verified.', 50),
  ('delivery.access.title', 'delivery', 'Site access headline', 'text', 'Six checks before delivery day.', 60),
  ('delivery.access.body', 'delivery', 'Site access body', 'textarea', 'A container is a heavy, awkward load. These are the things the driver and crane operator will look at — better to find them now.', 70),
  ('contact.hero.body', 'contact', 'Contact hero body', 'textarea', 'Call, WhatsApp or send the form below. A real person at the yard will answer — not a call centre. If you are nearby, come and inspect the unit yourself.', 10),
  ('contact.form.intro', 'contact', 'Contact form intro', 'textarea', 'The form saves your enquiry and opens WhatsApp with your details filled in. You will receive a reference so the yard can find your request.', 20)
on conflict (key) do nothing;

create unique index if not exists faqs_question_unique_idx
  on public.faqs (lower(question));

create unique index if not exists gallery_src_unique_idx
  on public.gallery_items (src);

insert into public.faqs (question, answer, category, position, active)
values
  ('How much does delivery cost?', 'Delivery is quoted per trip after we check the site access, ground conditions and offload requirements. We confirm the figure in writing before dispatch. Fixed delivery prices are not published because access changes the job.', 'delivery', 10, true),
  ('Can I pay with M-Pesa or bank transfer?', 'Yes. We accept M-Pesa and bank transfer. For stock units, we typically agree a deposit to reserve the container and settle the balance before delivery. For fabricated units, payment follows the build milestones. We issue a written quotation and receipt for every payment.', 'payment', 20, true),
  ('How long does fabrication take?', 'Lead time depends on the specification and the yard schedule. We confirm the expected lead time in your written quotation before work starts.', 'fabrication', 30, true),
  ('Do I need a permit for a container home or office?', 'For a permanent container home, expect the same county planning and NEMA considerations as a conventional structure. Temporary site offices are usually simpler, but the host site must still approve placement. We can share our drawings and documentation to support your application, but approval remains with the relevant authorities.', 'permits', 40, true),
  ('What do WWT and cargo worthy mean?', 'WWT means wind and watertight: the container has no holes and the door seals keep out weather, though it may show surface rust or dents. Cargo worthy means the unit is structurally sound and suitable for freight or conversion. Every listing states the grade. Ask for the current condition notes and inspection photos for the exact unit.', 'condition', 50, true),
  ('Can I inspect the container before paying?', 'Yes. Contact the yard to arrange a viewing and confirm current opening hours. If you are upcountry, we can send current photos and a video walkaround of the exact container where available, including the serial and any CSC plate. Confirm what is available before paying. We do not swap units after payment.', 'inspection', 60, true),
  ('Do you deliver outside Kenya?', 'We focus on Kenya and occasionally support cross-border projects in Uganda, Tanzania, Rwanda and South Sudan. Cross-border moves need customs coordination, so we quote them separately and confirm the paperwork before committing.', 'delivery', 70, true),
  ('What documents come with a container?', 'Paperwork is confirmed against the exact unit before payment. Depending on the unit, this can include a bill of sale, condition notes, serial details and a CSC plate where applicable. Fabricated units can include electrical and plumbing layout drawings where relevant, plus a fit-out snag list. Ask what is available for the unit you are considering.', 'documents', 80, true),
  ('Is a reefer expensive to run?', 'A working reefer draws significant power, usually from a 3-phase supply. Running costs depend on the setpoint, ambient temperature and how often the door is opened. Ask for the current test sheet and power requirements so your electrician can size the supply before delivery.', 'refrigeration', 90, true),
  ('Can you fit out a container I already own?', 'Yes, subject to an inspection. We check the shell for structural condition before quoting fabrication. If the unit is not a sound base, we will say so rather than cover a problem with lining.', 'fabrication', 100, true)
on conflict do nothing;

insert into public.gallery_items (title, caption, src, alt, position, publication_status)
values
  ('Retail kiosks', 'Red kiosk units in the yard.', '/media/images/yard/kiosk-row-red.jpg', 'Red container retail kiosks with white roller shutters', 10, 'published'),
  ('Office fit-out', 'Finished office interior with glazing and a timber floor.', '/media/images/interiors/office-interior.jpg', 'Finished container office interior with glass doors and timber floor', 20, 'published'),
  ('Container home', 'Clad container home with a timber veranda.', '/media/images/homes/container-home-exterior.jpg', 'Container home exterior with a timber veranda', 30, 'published'),
  ('Yard stock', 'High cube containers stacked and ready for inspection.', '/media/images/yard/container-stack-high-cube.jpg', 'High cube containers stacked in the yard', 40, 'published')
on conflict do nothing;

insert into public.announcements (message, active)
values ('All listings are yard examples. Confirm current availability and the exact unit before paying.', false)
on conflict do nothing;
