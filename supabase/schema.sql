create extension if not exists pgcrypto;

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  abstract text not null,
  domain text not null,
  status text not null check (
    status in (
      'moderation',
      'community_reviewed',
      'expert_reviewed',
      'recommended',
      'validated'
    )
  ),
  version integer not null default 1,
  author_name text not null,
  author_orcid text,
  ai_novelty integer not null default 50,
  ai_rigor integer not null default 50,
  ai_reproducibility integer not null default 50,
  ai_translation integer not null default 50,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions(id) on delete cascade,
  reviewer_name text not null,
  expertise text not null,
  review_type text not null check (review_type in ('comment', 'formal')),
  novelty integer not null check (novelty between 1 and 5),
  rigor integer not null check (rigor between 1 and 5),
  reproducibility integer not null check (reproducibility between 1 and 5),
  impact integer not null check (impact between 1 and 5),
  verdict text not null,
  summary text not null,
  created_at timestamptz not null default now()
);

create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references submissions(id) on delete cascade,
  label text not null check (label in ('recommended', 'validated', 'major_concerns')),
  rationale text not null,
  committee_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_submissions_created_at on submissions (created_at desc);
create index if not exists idx_reviews_submission_id on reviews (submission_id);
create index if not exists idx_recommendations_submission_id on recommendations (submission_id);
