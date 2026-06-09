# Bookmarks Space

A personal bookmark manager with public profiles — save, organise, and share your favourite links.

🔗 **Live:** [bookmarks-app-lake.vercel.app](https://bookmarks-app-lake.vercel.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Auth & Database | [Supabase](https://supabase.com) (Postgres + Row Level Security) |
| Styling | Tailwind CSS |
| Transactional Email | [Resend](https://resend.com) |
| Deployment | [Vercel](https://vercel.com) |

---

## Features

- **Auth** — Sign up with email, password, and a unique `@handle`. Log in / log out.
- **Dashboard** — Create, edit, and delete bookmarks. Mark them public or private.
- **Search & Filter** — Instantly filter bookmarks by title/URL or by visibility (All / Public / Private).
- **Public Profiles** — Anyone can visit `/<handle>` to browse a user's public bookmarks — no login required.
- **Welcome Email** — New users receive a branded welcome email via Resend after signup.
- **Security** — User IDs are always derived from the server session (`supabase.auth.getUser()`), never from client-supplied form data.

---

## Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/irajverma/bookmarks-app.git
cd bookmarks-app

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local
```

Open `.env.local` and fill in your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
RESEND_API_KEY=<your-resend-api-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

```bash
# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** Resend's `onboarding@resend.dev` sender only delivers to your own verified email while in sandbox mode. Add and verify a custom domain at [resend.com/domains](https://resend.com/domains) to send to any address.

---

## Database Schema

Two tables are required in your Supabase project:

```sql
-- Stores user handles
create table profiles (
  id uuid primary key references auth.users(id),
  handle text unique not null,
  created_at timestamptz default now()
);

-- Stores bookmarks
create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  title text not null,
  url text not null,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## Where the AI Got It Wrong

Building this with an AI coding assistant was fast — but it wasn't perfect. Here's where I had to step in:

### 1. Missing `handle` field on the signup form

The AI's first implementation of the signup flow only included `email` and `password`. I noticed immediately that the `profiles` table required a `handle` column, so there was no way for a user to pick their public username.

I explicitly requested that the AI add the handle field to both the form UI and the server action, along with a uniqueness check against the `profiles` table *before* creating the auth account — so we'd never end up with an orphaned auth user that has no profile.

### 2. Server Component event handler crash

The public profile page (`/[handle]`) was a Server Component, but the AI placed an `onError` event handler directly on an `<img>` tag inside it:

```tsx
<img onError={(e) => { /* mutate DOM */ }} />
```

React doesn't allow event handlers in Server Components — the page crashed at runtime with an `Unhandled Runtime Error`. I caught this when I first visited my profile page. The fix was to extract the image into a separate `'use client'` component (`Favicon.tsx`) that manages the error state with `useState`, which the AI then implemented correctly.

### 3. Entire CLI Session Recording (Windows Compatibility)

The Entire CLI session recording encountered a Windows compatibility issue because the hooks rely on `sh`, which isn't natively available on Windows. As a result, sessions were not auto-captured. To compensate, manual session logs were saved to [`.entire/sessions/`](file:///a:/Demo folder/bookmarks-app/.entire/sessions/) documenting each agent interaction, what was built, and where corrections were made.

---

## One Thing I'd Improve With More Time

**Custom domain email sending and a proper email template system.**

Right now, welcome emails are sent from Resend's default `onboarding@resend.dev` address, which only works in sandbox mode for a single verified address. With more time, I'd:

1. Verify a custom domain (e.g. `hello@bookmarksspace.app`) so emails land in the inbox rather than appearing as sandbox-only test messages.
2. Build proper React Email templates (using the [`react-email`](https://react.email) library) for a consistent, on-brand email experience — welcome email, email verification, password reset, and eventually a weekly digest of trending public bookmarks.

---

## Project Structure

```
app/
├── [handle]/           # Public profile pages
│   ├── page.tsx        # Server-rendered public bookmark list
│   └── Favicon.tsx     # Client component for favicon with fallback
├── actions/
│   └── sendWelcomeEmail.ts   # Resend email action (server-only)
├── dashboard/
│   ├── page.tsx        # Protected dashboard (server)
│   ├── DashboardClient.tsx   # Search & filter (client)
│   ├── BookmarkItem.tsx      # Inline edit/delete (client)
│   ├── CreateBookmarkForm.tsx
│   └── actions.ts      # CRUD server actions
├── login/
│   ├── page.tsx        # Login form
│   └── actions.ts      # login / signup / signOut
├── signup/
│   └── page.tsx        # Signup form
└── auth/               # Supabase OAuth/magic-link handlers
utils/
└── supabase/
    ├── client.ts       # Browser Supabase client
    ├── server.ts       # Async server Supabase client
    ├── middleware.ts   # Session refresh + route protection
    └── admin.ts        # Service-role client (bypasses RLS)
```

---

## License

MIT
