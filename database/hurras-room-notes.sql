create table public.hf_room_notes (
 room_id uuid primary key references public.hf_rooms(id) on delete cascade,
 body text not null default '' check (char_length(body)<=20000),
 updated_at timestamptz not null default now()
);
alter table public.hf_room_notes enable row level security;
grant select,insert,update on public.hf_room_notes to authenticated;
create policy hf_notes_read on public.hf_room_notes for select to authenticated using(hf_private.member(room_id));
create policy hf_notes_create on public.hf_room_notes for insert to authenticated with check(hf_private.owner(room_id) and hf_private.member(room_id));
create policy hf_notes_update on public.hf_room_notes for update to authenticated using(hf_private.owner(room_id) and hf_private.member(room_id)) with check(hf_private.owner(room_id) and hf_private.member(room_id));
