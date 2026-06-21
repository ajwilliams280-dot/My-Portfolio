-- Create photos table
create table public.photos (
  id text primary key,
  title text not null,
  description text,
  category text not null,
  subcategory text,
  media_url text not null,
  thumbnail_url text,
  upload_date timestamp with time zone not null default now(),
  tags text[],
  featured boolean default false,
  photo_categories text[],
  auto_tags text[]
);

-- Enable RLS
alter table public.photos enable row level security;

-- Policies for photos
create policy "Allow public read access"
  on public.photos for select
  using (true);

create policy "Allow authenticated insert"
  on public.photos for insert
  to authenticated
  with check (true);

create policy "Allow authenticated update"
  on public.photos for update
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated delete"
  on public.photos for delete
  to authenticated
  using (true);

-- Create storage bucket for photos
insert into storage.buckets (id, name, public)
values ('portfolio-photos', 'portfolio-photos', true)
on conflict (id) do nothing;

-- Policies for storage.objects
create policy "Allow public read access on portfolio-photos"
  on storage.objects for select
  using (bucket_id = 'portfolio-photos');

create policy "Allow authenticated insert on portfolio-photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-photos');

create policy "Allow authenticated update on portfolio-photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-photos')
  with check (bucket_id = 'portfolio-photos');

create policy "Allow authenticated delete on portfolio-photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-photos');
