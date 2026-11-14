# Secure Notes

Private progress notes for the tutors of a lesson centre. Each tutor signs
up with an email and password and sees only their own notes — the privacy is
enforced by the database, not the website, so a mistake in the site can't
leak a note.

Built by Group 4 of the AI-fullstack cohort (week 4). The brief and
acceptance criteria are in [SPEC.md](./SPEC.md).

## Live link

_Add your Vercel link here after deploying._

## How it works

- **Next.js 16** (App Router, server actions, Tailwind 4), deployed on Vercel.
- **Supabase Auth** keeps the login in cookies; `proxy.ts` checks it with
  `getUser()` on every request and sends logged-out visitors to `/login`.
- **Row-level security** is on for the `notes` table with four policies
  (select, insert, update, delete), each `user_id = auth.uid()`. The app
  never sends a `user_id` and never filters by it — the database fills it in
  and refuses the wrong person.
- The app uses only the project URL and the **publishable key**. The
  database password and `service_role`/`sb_secret_` keys skip row-level
  security, so they appear nowhere in this app.

## Set up Supabase

1. Create (or open) the Supabase project and run [db/schema.sql](./db/schema.sql)
   once in **SQL Editor**. **Authentication → Policies** should then show RLS
   enabled with 4 policies on `notes`.
2. Turn off **Confirm email** under Authentication → Sign In / Providers.
3. Copy the **Project URL** (ends in `.supabase.co`) and the publishable key
   from **Project Settings → Data API**.

## Run it locally

```bash
npm install
```

Create `.env.local` in this folder (it stays out of Git):

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Then `npm run dev` and open http://localhost:3000. Sign up with any email —
nothing is sent.

## Deploy

```bash
npx vercel link
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
npx vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY production
npx vercel --prod
```

Add both settings before `vercel --prod`: `NEXT_PUBLIC_` values are baked in
at build time.
