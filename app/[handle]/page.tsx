import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Favicon } from './Favicon'

type Profile = {
  id: string
  handle: string
  created_at: string
}

type Bookmark = {
  id: string
  title: string
  url: string
  is_public: boolean
  created_at: string
}

// Separate metadata generator
export async function generateMetadata({ params }: { params: { handle: string } }) {
  const handle = decodeURIComponent(params.handle)
  return {
    title: `@${handle}'s Public Bookmarks`,
    description: `Browse curated links and public bookmarks shared by @${handle}.`,
  }
}

export default async function PublicProfilePage({ params }: { params: { handle: string } }) {
  const handle = decodeURIComponent(params.handle)
  const supabase = await createClient()

  // 1. Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, handle, created_at')
    .eq('handle', handle)
    .maybeSingle<Profile>()

  if (profileError || !profile) {
    notFound()
  }

  // 2. Fetch public bookmarks
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('id, title, url, is_public, created_at')
    .eq('user_id', profile.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .returns<Bookmark[]>()

  const publicBookmarks = bookmarks ?? []

  // Check if current user is logged in
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="max-w-3xl mx-auto px-6 pt-16 pb-10 flex flex-col items-center gap-6 text-center">
        {/* User avatar/badge */}
        <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-pink-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-xl shadow-indigo-500/15">
          {handle.substring(0, 1).toUpperCase()}
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            @{profile.handle}
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            Curating links since {new Date(profile.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 text-xs font-semibold bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 rounded-xl transition-all shadow-md shadow-black/10"
            >
              Back to Dashboard
            </Link>
          ) : (
            <Link
              href="/signup"
              className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/10 transition-all"
            >
              Create Your Space
            </Link>
          )}
        </div>
      </header>

      {/* ── Bookmarks List ────────────────────────────────────────────────── */}
      <main className="max-w-2xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-6">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Public Bookmarks
          </h2>
          <span className="text-xs text-zinc-500 font-mono">
            {publicBookmarks.length} link{publicBookmarks.length !== 1 && 's'}
          </span>
        </div>

        {publicBookmarks.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 border border-dashed border-zinc-900 rounded-3xl bg-zinc-900/10 backdrop-blur-sm text-center">
            <svg
              className="w-10 h-10 text-zinc-700 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-zinc-400 font-medium">Nothing shared yet</p>
              <p className="text-xs text-zinc-600">Public bookmarks added by @{handle} will show up here.</p>
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {publicBookmarks.map((bookmark) => {
              const hostname = (() => {
                try {
                  return new URL(bookmark.url).hostname.replace(/^www\./, '')
                } catch {
                  return bookmark.url
                }
              })()

              return (
                <li
                  key={bookmark.id}
                  className="group flex items-center justify-between gap-4 px-5 py-4 bg-zinc-900/40 border border-zinc-900 rounded-2xl hover:border-zinc-800 hover:bg-zinc-900/80 transition-all duration-200"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Favicon container */}
                    <div className="h-10 w-10 shrink-0 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
                      <Favicon hostname={hostname} />
                    </div>

                    <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-zinc-200 hover:text-blue-400 transition-colors truncate max-w-md"
                      >
                        {bookmark.title}
                      </a>
                      <p className="text-xs text-zinc-500 font-medium truncate">{hostname}</p>
                    </div>
                  </div>

                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl transition-all shrink-0"
                    title="Visit link"
                  >
                    <svg
                      className="w-4.5 h-4.5"
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
                </li>
              )
            })}
          </ul>
        )}
      </main>
    </div>
  )
}
