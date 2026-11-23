-- Publish "inspection only" units while keeping sold and unavailable private.

drop policy if exists "Public can read published containers" on public.containers;
create policy "Public can read published containers"
on public.containers for select
to anon, authenticated
using (
  publication_status = 'published'
  and status in ('available', 'reserved', 'inspection')
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
      and containers.status in ('available', 'reserved', 'inspection')
  )
);
