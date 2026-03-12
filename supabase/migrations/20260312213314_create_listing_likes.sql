create table if not exists public.listing_likes (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (listing_id, user_id)
);

create index if not exists listing_likes_listing_id_idx on public.listing_likes (listing_id);
create index if not exists listing_likes_user_id_idx on public.listing_likes (user_id);

alter table public.listing_likes enable row level security;

create policy "Users can view all listing likes"
on public.listing_likes
for select
to anon, authenticated
using (true);

create policy "Users can insert their own likes"
on public.listing_likes
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete their own likes"
on public.listing_likes
for delete
to authenticated
using (auth.uid() = user_id);