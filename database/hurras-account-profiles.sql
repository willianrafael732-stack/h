create table public.hf_profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '' check (char_length(display_name)<=80),
 created_at timestamptz not null default now()
);
alter table public.hf_profiles enable row level security;
grant select,insert,update on public.hf_profiles to authenticated;
create policy hf_profile_read on public.hf_profiles for select to authenticated using ((select auth.uid())=id);
create policy hf_profile_create on public.hf_profiles for insert to authenticated with check ((select auth.uid())=id);
create policy hf_profile_update on public.hf_profiles for update to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id);
insert into public.hf_profiles(id,display_name)
select id,left(coalesce(raw_user_meta_data->>'display_name',raw_user_meta_data->>'full_name','Aventureiro'),80) from auth.users on conflict(id) do nothing;