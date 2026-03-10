alter table public.games enable row level security;
alter table public.profiles enable row level security;
alter table public.listings enable row level security;

drop policy if exists "Public can read games" on public.games;
create policy "Public can read games"
on public.games
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read profiles" on public.profiles;
create policy "Public can read profiles"
on public.profiles
for select
to anon, authenticated
using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Public can read active listings" on public.listings;
drop policy if exists "Public can read listings" on public.listings;
create policy "Public can read listings"
on public.listings
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated users can create own listings" on public.listings;
create policy "Authenticated users can create own listings"
on public.listings
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own listings" on public.listings;
create policy "Users can update own listings"
on public.listings
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
