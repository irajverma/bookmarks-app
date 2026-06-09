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
      className="w-full px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Creating account…
        </>
      ) : (
        'Create account'
      )}
    </button>
  )
}

const inputClass =
  'px-4 py-3 border border-zinc-800 focus:border-blue-500/80 rounded-xl bg-zinc-950/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm w-full text-zinc-100 placeholder:text-zinc-600 transition-all'

export default function SignupPage() {
  const [state, formAction] = useFormState(signup, initialState)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 px-4 relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900/40 border border-zinc-900 rounded-3xl shadow-2xl p-8 backdrop-blur-md flex flex-col gap-6 relative z-10">
        <div className="flex flex-col gap-2">
          {/* Logo Icon */}
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-600 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-indigo-500/10 mb-2">
            B
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Create an account
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">
              Log in
            </Link>
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          {state.error && (
            <div className="text-xs text-red-400 bg-red-950/20 border border-red-900/50 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-semibold text-red-200">Registration failed</p>
                <p className="text-red-300/80 mt-0.5 leading-relaxed">{state.error}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-email" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-1">
              Email Address
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
            <label htmlFor="signup-password" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-1">
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
            <label htmlFor="signup-handle" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-1">
              Choose Handle
            </label>
            <div className="flex items-stretch border border-zinc-800 focus-within:border-blue-500/80 rounded-xl bg-zinc-950/60 focus-within:ring-2 focus-within:ring-blue-500/30 transition-all overflow-hidden">
              <span className="flex items-center px-3.5 bg-zinc-900 border-r border-zinc-800 text-zinc-500 text-sm font-semibold select-none">
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
                className="flex-1 px-3 py-3 bg-transparent focus:outline-none text-sm text-zinc-100 placeholder:text-zinc-600"
              />
            </div>
            <p className="text-[10px] text-zinc-500 px-1">
              Letters, numbers, underscores, and hyphens only. Permanent.
            </p>
          </div>

          <div className="pt-2">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  )
}
