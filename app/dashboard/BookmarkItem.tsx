'use client'

import { useState, useEffect, useRef } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { updateBookmark, deleteBookmark, type ActionState } from './actions'

export type Bookmark = {
  id: string
  title: string
  url: string
  is_public: boolean
  created_at: string
}

const initialState: ActionState = { error: null }

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-md shadow-blue-900/10 flex items-center gap-1.5"
    >
      {pending ? (
        <>
          <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Saving…
        </>
      ) : (
        'Save Changes'
      )}
    </button>
  )
}

function DeleteButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-all disabled:opacity-50"
      title="Delete bookmark"
      onClick={(e) => {
        if (!confirm('Are you sure you want to delete this bookmark?')) {
          e.preventDefault()
        }
      }}
    >
      {pending ? (
        <svg className="animate-spin h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )}
    </button>
  )
}

const editInputClass =
  'px-3 py-2 text-sm bg-zinc-950/80 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/80 text-zinc-200 placeholder:text-zinc-500 transition-all w-full'

export function BookmarkItem({ bookmark }: { bookmark: Bookmark }) {
  const [isEditing, setIsEditing] = useState(false)
  const [updateState, updateAction] = useFormState(updateBookmark, initialState)
  const lastSavedAt = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (
      updateState.savedAt !== undefined &&
      updateState.savedAt !== lastSavedAt.current
    ) {
      lastSavedAt.current = updateState.savedAt
      setIsEditing(false)
    }
  }, [updateState.savedAt])

  const hostname = (() => {
    try {
      return new URL(bookmark.url).hostname.replace(/^www\./, '')
    } catch {
      return bookmark.url
    }
  })()

  // ── Edit mode ─────────────────────────────────────────────────────────────
  if (isEditing) {
    return (
      <li className="p-5 bg-zinc-900 border border-blue-900/40 rounded-2xl shadow-xl shadow-blue-950/5 relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
        <form action={updateAction} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={bookmark.id} />

          {updateState.error && (
            <p className="text-xs text-red-400 bg-red-950/20 border border-red-900/50 rounded-xl px-4 py-3">
              {updateState.error}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Title</label>
              <input
                name="title"
                type="text"
                defaultValue={bookmark.title}
                required
                placeholder="Bookmark title"
                className={editInputClass}
              />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">URL</label>
              <input
                name="url"
                type="text"
                defaultValue={bookmark.url}
                required
                placeholder="https://example.com"
                className={editInputClass}
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-800/60 pt-4 mt-1">
            <label className="flex items-center gap-2.5 text-xs text-zinc-400 cursor-pointer select-none hover:text-zinc-300 transition-colors">
              <input
                name="is_public"
                type="checkbox"
                defaultChecked={bookmark.is_public}
                className="w-4.5 h-4.5 rounded border-zinc-800 bg-zinc-950 text-blue-600 focus:ring-blue-500/50 focus:ring-offset-zinc-900 accent-blue-600 transition-all cursor-pointer"
              />
              Make public and visible to everyone
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl transition-all"
              >
                Cancel
              </button>
              <SaveButton />
            </div>
          </div>
        </form>
      </li>
    )
  }

  // ── View mode ─────────────────────────────────────────────────────────────
  return (
    <li className="group flex items-center justify-between gap-4 px-5 py-4 bg-zinc-900/30 border border-zinc-900/80 rounded-2xl hover:border-zinc-800/80 hover:bg-zinc-900/60 shadow-md shadow-black/5 hover:shadow-lg transition-all duration-200">
      
      {/* Left side: Icon + Metadata */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Favicon Container */}
        <div className="h-10 w-10 shrink-0 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex items-center justify-center overflow-hidden shadow-inner group-hover:border-zinc-700/60 transition-colors">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
            alt=""
            width={20}
            height={20}
            className="rounded shrink-0 object-contain opacity-90 group-hover:scale-105 transition-transform"
            onError={(e) => {
              // Replace image element with placeholder text/svg on error
              const parent = e.currentTarget.parentElement
              if (parent) {
                parent.innerHTML = `
                  <span class="text-xs font-bold text-zinc-500 font-mono">
                    ${hostname.substring(0, 2).toUpperCase()}
                  </span>
                `
              }
            }}
          />
        </div>

        {/* Title + URL Details */}
        <div className="min-w-0 flex-1 flex flex-col gap-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-zinc-100 hover:text-blue-400 transition-colors truncate max-w-sm"
            >
              {bookmark.title}
            </a>
            <span
              className={`shrink-0 inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                bookmark.is_public
                  ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30 shadow-inner'
                  : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/40 shadow-inner'
              }`}
            >
              {bookmark.is_public ? 'Public' : 'Private'}
            </span>
          </div>
          <p className="text-xs text-zinc-500 truncate font-medium">{hostname}</p>
        </div>
      </div>

      {/* Right side: Action Buttons */}
      <div className="flex items-center gap-1 shrink-0 md:opacity-0 group-hover:opacity-100 transition-all duration-200">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl transition-all"
          title="Edit bookmark"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <form action={deleteBookmark}>
          <input type="hidden" name="id" value={bookmark.id} />
          <DeleteButton />
        </form>
      </div>
    </li>
  )
}
