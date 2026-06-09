'use client'

import { useState } from 'react'
import { BookmarkItem, type Bookmark } from './BookmarkItem'

type DashboardClientProps = {
  bookmarks: Bookmark[]
}

export function DashboardClient({ bookmarks }: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all')

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch =
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'public' && bookmark.is_public) ||
      (filterType === 'private' && !bookmark.is_public)

    return matchesSearch && matchesFilter
  })

  const publicCount = bookmarks.filter((b) => b.is_public).length
  const privateCount = bookmarks.filter((b) => !b.is_public).length

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filters Glass Container */}
      <div className="p-4 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-2xl flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between shadow-xl shadow-black/20">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search bookmarks by title or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-950/60 border border-zinc-800/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/80 placeholder:text-zinc-500 text-zinc-200 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-950/80 border border-zinc-800/60 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === 'all'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All <span className="ml-1 text-[10px] text-zinc-500 font-mono">{bookmarks.length}</span>
          </button>
          <button
            onClick={() => setFilterType('public')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === 'public'
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/60 shadow-sm shadow-emerald-950/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Public <span className="ml-1 text-[10px] text-zinc-500 font-mono">{publicCount}</span>
          </button>
          <button
            onClick={() => setFilterType('private')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === 'private'
                ? 'bg-blue-950/60 text-blue-400 border border-blue-900/60 shadow-sm shadow-blue-950/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Private <span className="ml-1 text-[10px] text-zinc-500 font-mono">{privateCount}</span>
          </button>
        </div>
      </div>

      {/* Bookmarks List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            {filterType === 'all' ? 'All Bookmarks' : filterType === 'public' ? 'Public Bookmarks' : 'Private Bookmarks'}
          </span>
          <span className="text-xs text-zinc-500 font-mono">
            {filteredBookmarks.length} match{filteredBookmarks.length !== 1 && 'es'}
          </span>
        </div>

        {filteredBookmarks.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 border border-dashed border-zinc-800 rounded-2xl text-center bg-zinc-900/10 backdrop-blur-sm">
            <svg
              className="w-8 h-8 text-zinc-700 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-zinc-400 font-medium">No bookmarks found</p>
              <p className="text-xs text-zinc-600">Try adjusting your search query or filter type.</p>
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {filteredBookmarks.map((bookmark) => (
              <BookmarkItem key={bookmark.id} bookmark={bookmark} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
