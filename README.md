# Horsepower Electrical – Marketing Site + Admin Centre

Stack: React + TypeScript (Vite) · Express (serverless on Vercel) · Supabase (Auth, DB, RLS)

## Quick Start
- Add `.env` with Supabase URL/keys (see `.env.example`).
- Run the SQL in `supabase.sql` once in Supabase.
- `npm install && (cd frontend && npm install)`
- `npm run dev` (vite) or `vercel dev` (to include API locally)

## Deploy
- Push to GitHub → Import to Vercel → set env vars → Deploy.