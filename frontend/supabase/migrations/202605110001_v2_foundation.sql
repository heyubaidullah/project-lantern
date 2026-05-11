-- V2 foundation: optional metadata for life-state reflections and standalone journal notes.

alter table if exists public.journey_entries
  add column if not exists source text not null default 'journey',
  add column if not exists life_state_key text,
  add column if not exists life_state_label text,
  add column if not exists verse_key text,
  add column if not exists verse_text text,
  add column if not exists verse_translation text,
  add column if not exists journal_prompt text,
  add column if not exists journal_note text;

create table if not exists public.ah_journal_entries (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Journal note',
  note text not null,
  mood text,
  prompt text,
  created_at timestamptz not null default now()
);

alter table public.ah_journal_entries enable row level security;

create policy "Users can read their own journal entries"
  on public.ah_journal_entries
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own journal entries"
  on public.ah_journal_entries
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own journal entries"
  on public.ah_journal_entries
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own journal entries"
  on public.ah_journal_entries
  for delete
  using (auth.uid() = user_id);

create index if not exists ah_journal_entries_user_created_at_idx
  on public.ah_journal_entries (user_id, created_at desc);
