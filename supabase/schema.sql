-- OFFICER'S FRONT initial Supabase schema.
-- Run in Supabase SQL Editor. Review policies before production launch.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'student' check (role in ('student','admin')),
  telegram_user_id bigint,
  telegram_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  full_name text not null,
  description text not null default '',
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  subject text not null,
  topic text,
  question_text text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array'),
  correct_option integer not null check (correct_option >= 0),
  explanation text,
  marks numeric(6,2) not null default 1,
  negative_marks numeric(6,2) not null default 0.33,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_id uuid not null references public.exams(id),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  answers jsonb not null default '{}'::jsonb,
  score numeric(8,2),
  correct_count integer not null default 0,
  incorrect_count integer not null default 0,
  unattempted_count integer not null default 0,
  accuracy numeric(5,2)
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text not null default '',
  storage_path text,
  external_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  published_at timestamptz,
  is_published boolean not null default false
);

-- Profile row is created automatically for new auth users.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.exams enable row level security;
alter table public.questions enable row level security;
alter table public.test_attempts enable row level security;
alter table public.resources enable row level security;
alter table public.announcements enable row level security;

-- Students can read/update only their own profile (role is not client-editable in production).
create policy "profiles read own" on public.profiles for select to authenticated using (auth.uid() = id);
-- Restrict client-side profile edits to the display name only.
revoke update on public.profiles from authenticated;
grant update (full_name) on public.profiles to authenticated;
create policy "profiles update own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "published exams readable" on public.exams for select to anon, authenticated using (is_published = true);
-- Deliberately no student SELECT policy on questions: correct_option is sensitive.
-- A trusted server endpoint must return question text/options without the answer key.
create policy "own attempts readable" on public.test_attempts for select to authenticated using (auth.uid() = user_id);
-- Attempts are created/scored by a trusted server endpoint to prevent score tampering.
-- Students can only read their own completed attempts.
create policy "published resources readable" on public.resources for select to authenticated using (is_published = true);
create policy "published announcements readable" on public.announcements for select to anon, authenticated using (is_published = true);

insert into public.exams (slug,name,full_name,description,is_published) values
('cds','CDS','Combined Defence Services','Preparation for IMA, INA, AFA and OTA entry routes.',true),
('afcat','AFCAT','Air Force Common Admission Test','Preparation for Flying and Ground Duty branches.',true),
('nda','NDA','National Defence Academy','Preparation for Army, Navy and Air Force wings.',true)
on conflict (slug) do nothing;

-- IMPORTANT PRODUCTION TODO:
-- 1) Add admin-only policies using a trusted role claim or a server-verified profile role.
-- 2) Keep correct_option server-only; there is intentionally no student SELECT policy on questions.
-- 3) Move test generation/submission/scoring to a trusted Edge Function/Worker.
-- 4) Do not let students change role or telegram_verified from the client.
