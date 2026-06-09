'use client'

import { useState } from 'react'

type FaviconProps = {
  hostname: string
}

export function Favicon({ hostname }: FaviconProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <span className="text-xs font-bold text-zinc-500 font-mono select-none">
        {hostname.substring(0, 2).toUpperCase()}
      </span>
    )
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
      alt=""
      width={20}
      height={20}
      className="rounded shrink-0 object-contain opacity-80 transition-transform duration-200"
      onError={() => setHasError(true)}
    />
  )
}
