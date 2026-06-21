-- Create settings table
create table public.settings (
  id text primary key,
  name text,
  identity text,
  profile_image_url text,
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.settings enable row level security;

-- Policies for settings
create policy "Allow public read access on settings"
  on public.settings for select
  using (true);

create policy "Allow authenticated update on settings"
  on public.settings for update
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated insert on settings"
  on public.settings for insert
  to authenticated
  with check (true);

-- Create storage bucket for profile images
insert into storage.buckets (id, name, public)
values ('profile', 'profile', true)
on conflict (id) do nothing;

-- Policies for storage.objects in profile bucket
create policy "Allow public read access on profile bucket"
  on storage.objects for select
  using (bucket_id = 'profile');

create policy "Allow authenticated insert on profile bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'profile');

create policy "Allow authenticated update on profile bucket"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'profile')
  with check (bucket_id = 'profile');

create policy "Allow authenticated delete on profile bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'profile');

-- Insert default row for profile
insert into public.settings (id, name, identity, profile_image_url) 
values ('profile', '', '', '')
on conflict (id) do nothing;
