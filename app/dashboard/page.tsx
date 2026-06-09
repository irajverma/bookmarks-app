import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { signOut } from '@/app/login/actions'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Double-check server-side — middleware is first line of defence,
  // but we never rely solely on middleware for auth checks.
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Nav */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-semibold text-sm tracking-tight">Bookmarks</span>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Log out
            </button>
          </form>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to your dashboard</h1>
        <p className="text-zinc-500 text-sm">
          Logged in as <span className="font-medium text-zinc-800 dark:text-zinc-200">{user.email}</span>
        </p>
      </main>
    </div>
  )
}
