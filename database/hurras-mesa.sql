-- Hurras: mesas privadas, convites curtos, anexos e rolagens verificadas no servidor.
create schema if not exists hf_private;
revoke all on schema hf_private from public, anon;
grant usage on schema hf_private to authenticated;
create table public.hf_rooms(id uuid primary key default gen_random_uuid(), name text not null check(length(name) between 1 and 80), owner_id uuid not null references auth.users(id), created_at timestamptz not null default now());
create table public.hf_members(room_id uuid references public.hf_rooms(id) on delete cascade, user_id uuid references auth.users(id) on delete cascade, display_name text not null check(length(display_name) between 1 and 60), blocked boolean not null default false, joined_at timestamptz not null default now(), primary key(room_id,user_id));
create table hf_private.invites(room_id uuid primary key references public.hf_rooms(id) on delete cascade, token_hash bytea unique not null, expires_at timestamptz not null);
create table hf_private.join_attempts(user_id uuid primary key references auth.users(id) on delete cascade, started_at timestamptz not null default now(), attempts int not null default 0);
create table public.hf_messages(id bigint generated always as identity primary key, room_id uuid not null references public.hf_rooms(id) on delete cascade, user_id uuid not null references auth.users(id), kind text not null check(kind in ('text','file','roll')), body text not null default '' check(length(body)<=4000), file_path text, file_name text check(length(file_name)<=180), mime_type text, roll jsonb, created_at timestamptz not null default now(), check((kind='text' and length(trim(body))>0 and file_path is null and roll is null) or (kind='file' and file_path is not null and roll is null) or (kind='roll' and roll is not null and file_path is null)));
create index hf_messages_room_time on public.hf_messages(room_id,id desc);
create index hf_members_user on public.hf_members(user_id);
create index hf_rooms_owner on public.hf_rooms(owner_id);
create index hf_messages_user on public.hf_messages(user_id);
alter table public.hf_rooms enable row level security;
alter table public.hf_members enable row level security;
alter table public.hf_messages enable row level security;
alter table hf_private.invites enable row level security;
alter table hf_private.join_attempts enable row level security;
create function hf_private.member(p_room uuid) returns boolean language sql stable security definer set search_path='' as $$ select auth.uid() is not null and exists(select 1 from public.hf_members where room_id=p_room and user_id=auth.uid() and not blocked) $$;
create function hf_private.owner(p_room uuid) returns boolean language sql stable security definer set search_path='' as $$ select auth.uid() is not null and exists(select 1 from public.hf_rooms where id=p_room and owner_id=auth.uid()) $$;
create policy hf_room_read on public.hf_rooms for select to authenticated using(hf_private.member(id));
create policy hf_member_read on public.hf_members for select to authenticated using(hf_private.member(room_id));
create policy hf_message_read on public.hf_messages for select to authenticated using(hf_private.member(room_id));
create policy hf_message_send on public.hf_messages for insert to authenticated with check(user_id=(select auth.uid()) and hf_private.member(room_id) and (kind='text' or (kind='file' and split_part(file_path,'/',1)=room_id::text and split_part(file_path,'/',2)=(select auth.uid())::text and exists(select 1 from storage.objects where bucket_id='hurras-chat' and name=file_path))));
create policy hf_message_delete on public.hf_messages for delete to authenticated using(hf_private.member(room_id) and (user_id=(select auth.uid()) or hf_private.owner(room_id)));
grant select on public.hf_rooms,public.hf_members to authenticated;
grant select,insert,delete on public.hf_messages to authenticated;
grant usage,select on sequence public.hf_messages_id_seq to authenticated;
revoke all on public.hf_rooms,public.hf_members,public.hf_messages from anon;
create function hf_private.rotate_invite(p_room uuid) returns text language plpgsql security definer set search_path='' as $$ declare token text; begin
 if auth.uid() is null or not hf_private.owner(p_room) then raise exception 'Somente o mestre pode gerar convites'; end if;
 token:=translate(encode(extensions.gen_random_bytes(9),'base64'),'+/','-_');
 insert into hf_private.invites values(p_room,extensions.digest(token,'sha256'),now()+interval '7 days') on conflict(room_id) do update set token_hash=excluded.token_hash,expires_at=excluded.expires_at;
 return token; end $$;
create function hf_private.create_room(p_name text,p_display text) returns jsonb language plpgsql security definer set search_path='' as $$ declare rid uuid; token text; begin
 if auth.uid() is null then raise exception 'Entre na sua conta'; end if;
 if length(trim(p_name)) not between 1 and 80 or length(trim(p_display)) not between 1 and 60 then raise exception 'Nome inválido'; end if;
 if (select count(*) from public.hf_rooms where owner_id=auth.uid())>=30 then raise exception 'Limite de 30 mesas'; end if;
 insert into public.hf_rooms(name,owner_id) values(trim(p_name),auth.uid()) returning id into rid;
 insert into public.hf_members(room_id,user_id,display_name) values(rid,auth.uid(),trim(p_display));
 token:=hf_private.rotate_invite(rid); return jsonb_build_object('room_id',rid,'invite',token); end $$;
create function hf_private.join_room(p_code text,p_display text) returns jsonb language plpgsql security definer set search_path='' as $$ declare rid uuid; tries int; begin
 if auth.uid() is null then raise exception 'Entre na sua conta'; end if;
 insert into hf_private.join_attempts values(auth.uid(),now(),1) on conflict(user_id) do update set started_at=case when hf_private.join_attempts.started_at<now()-interval '1 minute' then now() else hf_private.join_attempts.started_at end, attempts=case when hf_private.join_attempts.started_at<now()-interval '1 minute' then 1 else hf_private.join_attempts.attempts+1 end returning attempts into tries;
 if tries>8 then return jsonb_build_object('error','Aguarde um minuto antes de tentar novamente'); end if;
 if p_code !~ '^[A-Za-z0-9_-]{12}$' or length(trim(p_display)) not between 1 and 60 then return jsonb_build_object('error','Convite ou nome inválido'); end if;
 select room_id into rid from hf_private.invites where token_hash=extensions.digest(p_code,'sha256') and expires_at>now();
 if rid is null then return jsonb_build_object('error','Convite inválido ou expirado'); end if;
 if exists(select 1 from public.hf_members where room_id=rid and user_id=auth.uid() and blocked) then return jsonb_build_object('error','Acesso removido pelo mestre'); end if;
 insert into public.hf_members(room_id,user_id,display_name) values(rid,auth.uid(),trim(p_display)) on conflict(room_id,user_id) do update set display_name=excluded.display_name;
 return jsonb_build_object('room_id',rid); end $$;
create function hf_private.set_member(p_room uuid,p_user uuid,p_blocked boolean) returns void language plpgsql security definer set search_path='' as $$ begin
 if not hf_private.owner(p_room) or auth.uid() is null or p_user=auth.uid() then raise exception 'Permissão negada'; end if;
 update public.hf_members set blocked=p_blocked where room_id=p_room and user_id=p_user; end $$;
create function hf_private.roll_d10(p_room uuid,p_count int,p_label text) returns jsonb language plpgsql security definer set search_path='' as $$ declare vals int[]:='{}'; value int; successes int:=0; failures int:=0; tens int:=0; ones int:=0; neutral int:=0; paired int; score int; result jsonb; begin
 if auth.uid() is null or not hf_private.member(p_room) then raise exception 'Entre nesta mesa primeiro'; end if;
 if p_count is null or p_count not between 1 and 200 or length(coalesce(p_label,''))>120 then raise exception 'Use de 1 a 200 d10'; end if;
 if exists(select 1 from public.hf_messages where room_id=p_room and user_id=auth.uid() and kind='roll' and created_at>clock_timestamp()-interval '1 second') then raise exception 'Aguarde um segundo entre rolagens'; end if;
 for i in 1..p_count loop
  loop value:=get_byte(extensions.gen_random_bytes(1),0); exit when value<250; end loop;
  value:=value%10+1; vals:=array_append(vals,value);
  if value=10 then tens:=tens+1; elsif value=1 then ones:=ones+1; elsif value>5 then successes:=successes+1; elsif value<5 then failures:=failures+1; else neutral:=neutral+1; end if;
 end loop;
 paired:=least(tens,ones); score:=successes-failures+2*(tens-paired)-2*(ones-paired);
 result:=jsonb_build_object('values',vals,'successes',successes,'failures',failures,'tens',tens,'ones',ones,'neutral',neutral,'cancelled',paired,'score',score,'label',coalesce(p_label,''));
 insert into public.hf_messages(room_id,user_id,kind,body,roll) values(p_room,auth.uid(),'roll',coalesce(p_label,''),result);
 return result; end $$;
-- Invoker wrappers: private implementations are not exposed through the Data API.
create function public.hf_create_room(p_name text,p_display text) returns jsonb language sql security invoker set search_path='' as $$ select hf_private.create_room(p_name,p_display) $$;
create function public.hf_join_room(p_code text,p_display text) returns jsonb language sql security invoker set search_path='' as $$ select hf_private.join_room(p_code,p_display) $$;
create function public.hf_rotate_invite(p_room uuid) returns text language sql security invoker set search_path='' as $$ select hf_private.rotate_invite(p_room) $$;
create function public.hf_set_member(p_room uuid,p_user uuid,p_blocked boolean) returns void language sql security invoker set search_path='' as $$ select hf_private.set_member(p_room,p_user,p_blocked) $$;
create function public.hf_roll_d10(p_room uuid,p_count int,p_label text default '') returns jsonb language sql security invoker set search_path='' as $$ select hf_private.roll_d10(p_room,p_count,p_label) $$;
revoke all on all functions in schema hf_private from public,anon;
grant execute on all functions in schema hf_private to authenticated;
revoke all on function public.hf_create_room(text,text),public.hf_join_room(text,text),public.hf_rotate_invite(uuid),public.hf_set_member(uuid,uuid,boolean),public.hf_roll_d10(uuid,int,text) from public,anon;
grant execute on function public.hf_create_room(text,text),public.hf_join_room(text,text),public.hf_rotate_invite(uuid),public.hf_set_member(uuid,uuid,boolean),public.hf_roll_d10(uuid,int,text) to authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('hurras-chat','hurras-chat',false,20971520,array['application/pdf','image/png','image/jpeg','image/webp','image/gif','audio/webm','audio/ogg','audio/mpeg','audio/mp4','audio/wav','audio/x-wav','video/webm']) on conflict(id) do nothing;
create policy hf_file_read on storage.objects for select to authenticated using(bucket_id='hurras-chat' and exists(select 1 from public.hf_rooms r where r.id::text=split_part(name,'/',1) and hf_private.member(r.id)));
create policy hf_file_send on storage.objects for insert to authenticated with check(bucket_id='hurras-chat' and split_part(name,'/',2)=(select auth.uid())::text and exists(select 1 from public.hf_rooms r where r.id::text=split_part(name,'/',1) and hf_private.member(r.id)));
create policy hf_file_delete on storage.objects for delete to authenticated using(bucket_id='hurras-chat' and exists(select 1 from public.hf_rooms r where r.id::text=split_part(name,'/',1) and hf_private.member(r.id) and (hf_private.owner(r.id) or split_part(name,'/',2)=(select auth.uid())::text)));
