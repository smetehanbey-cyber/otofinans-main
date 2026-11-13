create table public.vehicle_showcase (
  key uuid primary key,
  listing_number text not null check (listing_number ~ '^[0-9]{1,20}$'),
  vehicle text not null check (char_length(vehicle) between 1 and 120),
  image_url text not null check (
    char_length(image_url) <= 2800000 and (
      image_url ~ '^/assets/vehicle-listings/[0-9]+\.jpg$'
      or image_url ~ '^data:image/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$'
    )
  ),
  created_at timestamptz not null default now()
);

alter table public.vehicle_showcase enable row level security;
revoke all on public.vehicle_showcase from anon, authenticated;
grant select on public.vehicle_showcase to anon, authenticated;
create policy "Public vehicle showcase" on public.vehicle_showcase for select using (true);

create function public.save_showcase_vehicle(
  admin_pin text, vehicle_key uuid, number_value text, vehicle_name text, image_value text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.authorized_persons
    where pin::text = admin_pin and is_admin is true
      and coalesce(role, '') not like 'disabled%'
  ) then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  insert into public.vehicle_showcase (key, listing_number, vehicle, image_url)
  values (vehicle_key, number_value, vehicle_name, image_value)
  on conflict (key) do update
    set listing_number = excluded.listing_number,
        vehicle = excluded.vehicle,
        image_url = excluded.image_url;
end;
$$;

revoke all on function public.save_showcase_vehicle(text, uuid, text, text, text) from public;
grant execute on function public.save_showcase_vehicle(text, uuid, text, text, text) to anon, authenticated;
