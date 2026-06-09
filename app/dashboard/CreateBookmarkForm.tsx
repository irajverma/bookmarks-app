'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { createBookmark, type ActionState } from './actions'

const initialState: ActionState = { error: null }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] flex items-center gap-1.5"
    >
      {pending ? (
        <>
          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Adding…
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Bookmark
        </>
      )}
    </button>
  )
}

export function CreateBookmarkForm() {
  const [state, formAction] = useFormState(createBookmark, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <div className="text-sm text-red-400 bg-red-950/20 border border-red-900/50 rounded-xl px-4 py-3 flex items-start gap-2.5">
          <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-semibold text-red-200">Failed to create bookmark</p>
            <p className="text-xs text-red-300/80 mt-0.5">{state.error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-1 flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-1">
            Bookmark Title
          </label>
          <input
            name="title"
            type="text"
            placeholder="My favorite website"
            required
            className="w-full px-4 py-2.5 text-sm bg-zinc-950/60 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/80 placeholder:text-zinc-600 text-zinc-200 transition-all"
          />
        </div>
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-1">
            Destination URL
          </label>
          <input
            name="url"
            type="text"
            placeholder="https://example.com"
            required
            className="w-full px-4 py-2.5 text-sm bg-zinc-950/60 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/80 placeholder:text-zinc-600 text-zinc-200 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-800/40 pt-4 mt-1">
        <label className="flex items-center gap-2.5 text-xs text-zinc-400 cursor-pointer select-none hover:text-zinc-300 transition-colors">
          <input
            name="is_public"
            type="checkbox"
            className="w-4.5 h-4.5 rounded border-zinc-800 bg-zinc-950 text-blue-600 focus:ring-blue-500/50 focus:ring-offset-zinc-900 accent-blue-600 transition-all cursor-pointer"
          />
          Make public (anyone can view on your profile)
        </label>
        <SubmitButton />
      </div>
    </form>
  )
}
