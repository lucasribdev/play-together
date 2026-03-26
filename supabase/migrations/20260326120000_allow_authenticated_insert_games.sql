drop policy if exists "Authenticated users can create games" on public.games;
create policy "Authenticated users can create games"
on public.games
for insert
to authenticated
with check (true);
