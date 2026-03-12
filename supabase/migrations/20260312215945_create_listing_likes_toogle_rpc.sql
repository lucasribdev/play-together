create or replace function toggle_listing_like(p_listing_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_exists boolean;
begin

  select exists (
    select 1
    from listing_likes
    where listing_id = p_listing_id
    and user_id = v_user_id
  )
  into v_exists;

  if v_exists then
    delete from listing_likes
    where listing_id = p_listing_id
    and user_id = v_user_id;

    return false;
  else
    insert into listing_likes (listing_id, user_id)
    values (p_listing_id, v_user_id);

    return true;
  end if;

end;
$$;