-- Social calendar in CRM: content type + grouping, owner RLS (crons for instagram/threads were added via pg_cron separately)
alter table social_posts add column if not exists content_type text check (content_type in ('text','link','reel','image','carousel','article'));
alter table social_posts add column if not exists group_key text;
update social_posts set content_type = case
  when media_type='video' then 'reel' when media_type='image' then 'image'
  when platform='telegraph' then 'article'
  when destination_url is not null or content ~ 'https?://' then 'link' else 'text' end where content_type is null;
update social_posts set group_key = lower(regexp_replace(substring(title from '^(Daily \d+|Reel \d+)'), ' ', '-')) where group_key is null and title ~ '^(Daily \d+|Reel \d+)';
create index if not exists social_posts_sched_idx on social_posts (scheduled_at);
create policy crm_owner_select on social_posts for select to authenticated using (public.is_crm_owner());
create policy crm_owner_update on social_posts for update to authenticated using (public.is_crm_owner()) with check (public.is_crm_owner());
