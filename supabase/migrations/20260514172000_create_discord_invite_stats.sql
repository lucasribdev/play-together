create table if not exists public.discord_invite_stats (
  invite_code text primary key,
  approximate_presence_count integer,
  approximate_member_count integer,
  fetched_at timestamptz,
  next_fetch_after timestamptz,
  invalid_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_discord_invite_stats_updated_at on public.discord_invite_stats;
create trigger set_discord_invite_stats_updated_at
before update on public.discord_invite_stats
for each row
execute procedure public.set_updated_at();

alter table public.discord_invite_stats enable row level security;

grant select on public.discord_invite_stats to anon, authenticated;

drop policy if exists "Public can read Discord invite stats" on public.discord_invite_stats;
create policy "Public can read Discord invite stats"
on public.discord_invite_stats
for select
to anon, authenticated
using (true);

create or replace function public.upsert_discord_invite_stats(
  p_invite_code text,
  p_status text,
  p_approximate_presence_count integer,
  p_approximate_member_count integer,
  p_fetched_at timestamptz,
  p_next_fetch_after timestamptz,
  p_invalid_at timestamptz
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_invite_code is null or p_invite_code !~ '^[A-Za-z0-9_-]{2,100}$' then
    raise exception 'Invalid Discord invite code';
  end if;

  insert into public.discord_invite_stats (
    invite_code,
    approximate_presence_count,
    approximate_member_count,
    fetched_at,
    next_fetch_after,
    invalid_at,
    last_error
  )
  values (
    p_invite_code,
    p_approximate_presence_count,
    p_approximate_member_count,
    p_fetched_at,
    p_next_fetch_after,
    p_invalid_at,
    case when p_status = 'error' then 'fetch_failed' else null end
  )
  on conflict (invite_code) do update
  set
    approximate_presence_count = case
      when p_status in ('success', 'invalid') then excluded.approximate_presence_count
      else public.discord_invite_stats.approximate_presence_count
    end,
    approximate_member_count = case
      when p_status in ('success', 'invalid') then excluded.approximate_member_count
      else public.discord_invite_stats.approximate_member_count
    end,
    fetched_at = case
      when p_status in ('success', 'invalid') then excluded.fetched_at
      else public.discord_invite_stats.fetched_at
    end,
    next_fetch_after = excluded.next_fetch_after,
    invalid_at = case
      when p_status in ('success', 'invalid') then excluded.invalid_at
      else public.discord_invite_stats.invalid_at
    end,
    last_error = excluded.last_error,
    updated_at = now();
end;
$$;

grant execute on function public.upsert_discord_invite_stats(
  text,
  text,
  integer,
  integer,
  timestamptz,
  timestamptz,
  timestamptz
) to anon, authenticated;
