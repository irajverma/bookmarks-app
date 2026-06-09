import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { signOut } from '@/app/login/actions'
import { CreateBookmarkForm } from './CreateBookmarkForm'
import { DashboardClient } from './DashboardClient'
import { type Bookmark } from './BookmarkItem'

type Profile = {
  id: string
  handle: string
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // Verify server session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch profile and bookmarks in parallel
  const [{ data: profile }, { data: bookmarks }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, handle')
      .eq('id', user.id)
      .single<Profile>(),
    supabase
      .from('bookmarks')
      .select('id, title, url, is_public, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .returns<Bookmark[]>(),
  ])

  const list = bookmarks ?? []

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-hidden font-sans">
      {/* Premium glowing ambient light background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-blue-500/10 via-transparent to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-blue-500/20">
              B
            </div>
            <span className="font-semibold text-sm tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Bookmarks Space
            </span>
          </div>

          <div className="flex items-center gap-4">
            {profile?.handle && (
              <a
                href={`/${profile.handle}`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 font-mono bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 px-3 py-1.5 rounded-lg transition-all"
              >
                <span>@{profile.handle}</span>
                <svg
                  className="w-3.5 h-3.5 opacity-60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}

            <form action={signOut}>
              <button
                type="submit"
                className="text-xs px-3.5 py-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 transition-all font-medium"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ── Main Layout ─────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-10">
        
        {/* Profile Card & Stats Header */}
        <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-zinc-900/40 border border-zinc-900 rounded-2xl backdrop-blur-sm">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">
              Welcome back, {user.email?.split('@')[0]}
            </h1>
            <p className="text-xs text-zinc-400">
              Manage, search, and view all your curated bookmarks.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-zinc-950/60 border border-zinc-900 text-center min-w-[80px]">
              <div className="text-lg font-bold text-zinc-200 font-mono">{list.length}</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Total</div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-zinc-950/60 border border-zinc-900 text-center min-w-[80px]">
              <div className="text-lg font-bold text-emerald-400 font-mono">
                {list.filter(b => b.is_public).length}
              </div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Public</div>
            </div>
          </div>
        </section>

        {/* ── Add Bookmark Form ────────────────────────────────────────────── */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">
            Add New Bookmark
          </h2>
          <div className="p-6 bg-zinc-900/40 border border-zinc-900 rounded-2xl backdrop-blur-sm shadow-xl shadow-black/10">
            <CreateBookmarkForm />
          </div>
        </section>

        {/* ── Bookmarks Filter & List ───────────────────────────────────────── */}
        <section className="flex flex-col gap-3">
          <DashboardClient bookmarks={list} />
        </section>
      </main>
    </div>
  )
}
