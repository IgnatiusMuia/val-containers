-- Availability states used by the admin inventory workflow.
-- Additive migration: existing statuses and rows are unchanged.

alter type public.container_status add value if not exists 'unavailable';
alter type public.container_status add value if not exists 'inspection';
