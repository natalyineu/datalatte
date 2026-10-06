-- Inbound enquiries from datalatte.pro/contact (separate from outbound `leads`)
create table if not exists public.inquiries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null,
  name        text,
  niche       text,
  message     text,
  form_type   text,                       -- 'ready' | 'explore'
  status      text not null default 'new', -- new | replied | call | won | lost
  replied_at  timestamptz,
  notes       text
);
create index if not exists inquiries_created_idx on public.inquiries (created_at desc);
create index if not exists inquiries_email_idx on public.inquiries (lower(email));

-- RLS on, no policies: only the service-role key (server) can read/write
alter table public.inquiries enable row level security;

-- First inquiry (answered 2026-10-06 via Resend)
insert into public.inquiries (email, name, niche, message, form_type, status, replied_at, created_at)
values ('tampalocalmarketing@gmail.com', 'Clarke Gillies', 'other',
  'Roofer serving 16 counties in Florida. Interested in CTV advertising.',
  'ready', 'replied', '2026-10-06 15:38:38+00', '2026-10-06 15:00:00+00');
