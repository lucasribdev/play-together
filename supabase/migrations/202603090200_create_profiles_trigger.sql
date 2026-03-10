-- Create profile row when a new auth user is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    new.raw_user_meta_data->>'name'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

create or replace function public.increment_listing_views(p_listing_id uuid)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_views bigint;
begin
  update public.listings
  set views = views + 1
  where id = p_listing_id
    and active = true
  returning views into updated_views;

  return coalesce(updated_views, 0);
end;
$$;

grant execute on function public.increment_listing_views(uuid) to anon, authenticated;
