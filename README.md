# miniproj4.2
This is the repository for my mini project 4.2 (AI Assisted Personal Budgeting app
# Pesoly

AI-assisted personal budgeting app for Filipino users. Built with Next.js, TypeScript, Tailwind, Supabase, and OpenAI.

## Local setup

1. Install Node.js 22 and pnpm 11.
2. Run `pnpm install`.
3. Copy `.env.example` to `.env.local` and provide the Supabase project URL, Supabase publishable key, and OpenAI API key. The publishable key is designed for client-capable initialization and is constrained by RLS; keep the OpenAI key server-only and never use a `NEXT_PUBLIC_` prefix for it.
4. In Supabase, apply `supabase/migrations/202611220001_initial_schema.sql` using the Supabase CLI or SQL editor.
5. Configure Supabase Auth's Site URL and allowed redirect URLs for local and deployed app origins. Set the email confirmation policy you want for sign-up.
6. Run `pnpm dev`.

Deploy to Vercel by importing the repository and setting the same environment variables in the project settings. Row Level Security is the authorization boundary. Do not add a Supabase secret or service-role key to this application.

The AI assistant requires `OPENAI_API_KEY` and optionally `OPENAI_MODEL`. OpenAI requests run in a server route and receive only the signed-in user's current-month totals and category totals.

## Checks

Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.
