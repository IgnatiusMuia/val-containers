-- Enforce per-area permissions, add server-side idle sessions, and close the
-- remaining audit/rate-limit gaps. Additive and safe to re-run.

-- ---------------------------------------------------------------------------
-- Audit log: support tables keyed by user_id, integer ids or text keys
-- ---------------------------------------------------------------------------

alter table public.audit_log
  alter column record_id type text using record_id::text;

create or replace function public.log_audit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row jsonb;
  v_record_id text;
begin
  v_row := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  v_record_id := coalesce(
    v_row ->> 'id',
    v_row ->> 'user_id',
    v_row ->> 'key'
  );

  insert into public.audit_log (table_name, record_id, action, actor_id, changes)
  values (
    tg_table_name,
    v_record_id,
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

drop trigger if exists admin_users_audit on public.admin_users;
create trigger admin_users_audit
after insert or update or delete on public.admin_users
for each row execute function public.log_audit();

drop trigger if exists site_settings_audit on public.site_settings;
create trigger site_settings_audit
after insert or update or delete on public.site_settings
for each row execute function public.log_audit();

drop trigger if exists site_content_audit on public.site_content;
create trigger site_content_audit
after insert or update or delete on public.site_content
for each row execute function public.log_audit();

drop trigger if exists site_content_drafts_audit on public.site_content_drafts;
create trigger site_content_drafts_audit
after insert or update or delete on public.site_content_drafts
for each row execute function public.log_audit();

drop trigger if exists enquiry_attachments_audit on public.enquiry_attachments;
create trigger enquiry_attachments_audit
after insert or update or delete on public.enquiry_attachments
for each row execute function public.log_audit();

-- ---------------------------------------------------------------------------
-- Per-area permissions for inventory, media, enquiries and audit
-- ---------------------------------------------------------------------------

drop policy if exists "Admins can manage containers" on public.containers;
create policy "Admins can manage containers"
on public.containers for all
to authenticated
using (public.has_permission('inventory'))
with check (public.has_permission('inventory'));

drop policy if exists "Admins can manage container media" on public.container_media;
create policy "Admins can manage container media"
on public.container_media for all
to authenticated
using (public.has_permission('media'))
with check (public.has_permission('media'));

drop policy if exists "Admins can read leads" on public.leads;
create policy "Admins can read leads"
on public.leads for select
to authenticated
using (public.has_permission('enquiries'));

drop policy if exists "Admins can update leads" on public.leads;
create policy "Admins can update leads"
on public.leads for update
to authenticated
using (public.has_permission('enquiries'))
with check (public.has_permission('enquiries'));

drop policy if exists "Admins can read audit log" on public.audit_log;
create policy "Admins can read audit log"
on public.audit_log for select
to authenticated
using (public.is_owner());

drop policy if exists "Admins can read enquiries" on public.enquiries;
create policy "Admins can read enquiries"
on public.enquiries for select
to authenticated
using (public.has_permission('enquiries'));

drop policy if exists "Admins can update enquiries" on public.enquiries;
create policy "Admins can update enquiries"
on public.enquiries for update
to authenticated
using (public.has_permission('enquiries'))
with check (public.has_permission('enquiries'));

drop policy if exists "Admins can insert enquiries" on public.enquiries;
create policy "Admins can insert enquiries"
on public.enquiries for insert
to authenticated
with check (public.has_permission('enquiries'));

drop policy if exists "Admins manage enquiry attachments" on public.enquiry_attachments;
create policy "Admins manage enquiry attachments"
on public.enquiry_attachments for all
to authenticated
using (public.has_permission('enquiries'))
with check (public.has_permission('enquiries'));

drop policy if exists "Admins manage enquiry notes" on public.enquiry_notes;
create policy "Admins manage enquiry notes"
on public.enquiry_notes for all
to authenticated
using (public.has_permission('enquiries'))
with check (public.has_permission('enquiries'));

drop policy if exists "Admins manage enquiry quotations" on public.enquiry_quotations;
create policy "Admins manage enquiry quotations"
on public.enquiry_quotations for all
to authenticated
using (public.has_permission('enquiries'))
with check (public.has_permission('enquiries'));

drop policy if exists "Admins read enquiry activity" on public.enquiry_activity;
create policy "Admins read enquiry activity"
on public.enquiry_activity for select
to authenticated
using (public.has_permission('enquiries'));

drop policy if exists "Admins write enquiry activity" on public.enquiry_activity;
create policy "Admins write enquiry activity"
on public.enquiry_activity for insert
to authenticated
with check (public.has_permission('enquiries'));

drop policy if exists "Admins manage announcements" on public.announcements;
create policy "Admins manage announcements"
on public.announcements for all
to authenticated
using (public.is_owner())
with check (public.is_owner());

-- Storage write policies follow the same per-area permissions. The
-- container-media bucket stays public for now; public reads are unchanged.
drop policy if exists "Admins can upload container media objects" on storage.objects;
create policy "Admins can upload container media objects"
on storage.objects for insert
to authenticated
with check (bucket_id = 'container-media' and public.has_permission('media'));

drop policy if exists "Admins can update container media objects" on storage.objects;
create policy "Admins can update container media objects"
on storage.objects for update
to authenticated
using (bucket_id = 'container-media' and public.has_permission('media'))
with check (bucket_id = 'container-media' and public.has_permission('media'));

drop policy if exists "Admins can delete container media objects" on storage.objects;
create policy "Admins can delete container media objects"
on storage.objects for delete
to authenticated
using (bucket_id = 'container-media' and public.has_permission('media'));

drop policy if exists "Admins can read enquiry media objects" on storage.objects;
create policy "Admins can read enquiry media objects"
on storage.objects for select
to authenticated
using (bucket_id = 'enquiry-media' and public.has_permission('enquiries'));

drop policy if exists "Admins can upload enquiry media objects" on storage.objects;
create policy "Admins can upload enquiry media objects"
on storage.objects for insert
to authenticated
with check (bucket_id = 'enquiry-media' and public.has_permission('enquiries'));

drop policy if exists "Admins can delete enquiry media objects" on storage.objects;
create policy "Admins can delete enquiry media objects"
on storage.objects for delete
to authenticated
using (bucket_id = 'enquiry-media' and public.has_permission('enquiries'));

-- ---------------------------------------------------------------------------
-- Server-side idle sessions
-- ---------------------------------------------------------------------------

create or replace function public.touch_admin_session(p_idle_seconds integer default 28800)
returns table (
  active boolean,
  expired boolean,
  role text,
  display_name text,
  permissions text[]
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_row public.admin_users%rowtype;
begin
  select * into v_row
  from public.admin_users
  where user_id = auth.uid();

  if not found or not v_row.active then
    return query select false, false, null::text, null::text, '{}'::text[];
    return;
  end if;

  if v_row.last_seen_at is not null
     and v_now - v_row.last_seen_at > make_interval(secs => p_idle_seconds) then
    return query select false, true, v_row.role, v_row.display_name, v_row.permissions;
    return;
  end if;

  -- Throttle writes so normal navigation does not update on every request.
  if v_row.last_seen_at is null
     or v_now - v_row.last_seen_at > interval '60 seconds' then
    update public.admin_users
    set last_seen_at = v_now
    where user_id = v_row.user_id;
  end if;

  return query select true, false, v_row.role, v_row.display_name, v_row.permissions;
end;
$$;

revoke all on function public.touch_admin_session(integer) from public, anon;
grant execute on function public.touch_admin_session(integer) to authenticated;

-- ---------------------------------------------------------------------------
-- Rate limits: purge stale rows while consuming
-- ---------------------------------------------------------------------------

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
  delete from public.auth_rate_limits
  where updated_at < v_now - interval '1 day';

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
