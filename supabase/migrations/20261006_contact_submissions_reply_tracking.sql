alter table public.contact_submissions add column if not exists replied_at timestamptz, add column if not exists notes text;
