'use client'

import { useFormState, useFormStatus } from 'react-dom'
import Link from 'next/link'
import { signup, type ActionState } from '@/app/login/actions'

const initialState: ActionState = { error: null }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
    >
      {pending ? 'Creating account…' : 'Create account'}
    </button>
  )
}

const inputClass =
  'px-3 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full'

export default function SignupPage() {
  const [state, formAction] = useFormState(signup, initialState)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          {state.error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
              {state.error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              placeholder="Min. 8 characters"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-handle" className="text-sm font-medium">
              Handle
            </label>
            <div className="flex items-stretch border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <span className="flex items-center px-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-sm border-r border-zinc-200 dark:border-zinc-700 select-none">
                @
              </span>
              <input
                id="signup-handle"
                name="handle"
                type="text"
                required
                autoComplete="username"
                placeholder="yourhandle"
                pattern="[a-zA-Z0-9_\-]+"
                title="Letters, numbers, underscores, and hyphens only"
                className="flex-1 px-3 py-2.5 dark:bg-zinc-800 focus:outline-none text-sm"
              />
            </div>
            <p className="text-xs text-zinc-400">
              Letters, numbers, _ and - only. Cannot be changed later.
            </p>
          </div>

          <SubmitButton />
        </form>
      </div>
    </div>
  )
}
