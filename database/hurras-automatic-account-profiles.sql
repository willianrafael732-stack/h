create or replace function hf_private.create_account_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
 insert into public.hf_profiles(id,display_name)
 values(new.id,left(coalesce(nullif(new.raw_user_meta_data->>'display_name',''),nullif(new.raw_user_meta_data->>'full_name',''),'Aventureiro'),80))
 on conflict(id) do nothing;
 return new;
end;
$$;
revoke all on function hf_private.create_account_profile() from public,anon,authenticated;
create trigger hf_account_profile_created after insert on auth.users
for each row execute function hf_private.create_account_profile();
insert into public.hf_profiles(id,display_name)
select id,left(coalesce(nullif(raw_user_meta_data->>'display_name',''),nullif(raw_user_meta_data->>'full_name',''),'Aventureiro'),80)
from auth.users on conflict(id) do nothing;