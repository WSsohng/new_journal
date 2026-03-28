## TrustLayer Journal MVP

AI-native preprint platform + open review + overlay recommendation workflow.

## What is implemented

- Open preprint submission screen
- Submission repository list and detail page
- Structured open review form (comment/formal)
- Overlay recommendation form (`recommended`, `validated`, `major_concerns`)
- AI support score panel (novelty, rigor, reproducibility, translation)
- Supabase-backed data repository with mock fallback when env vars are missing

## Tech stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Supabase JS client

## Local run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase setup

1. Create a Supabase project.
2. Run SQL in [supabase/schema.sql](./supabase/schema.sql).
3. Copy env file and set keys:

```bash
cp .env.example .env.local
```

`.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

If env vars are not set, app runs with built-in demo data.

## Product model encoded in this MVP

1. Repository layer: free submission + moderation status entry point
2. Open review layer: public comments and formal reviews as structured objects
3. Trust layer: AI-assisted evidence scores + recommendation status
4. Overlay layer: selective human committee certification
