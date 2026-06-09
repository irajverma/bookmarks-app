'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export type ActionState = {
  error: string | null
  savedAt?: number  // unix ms of last successful save — used by client to close edit mode
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createBookmark(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  // Security: user_id is always derived from the server session, never from form data
  if (authError || !user) return { error: 'Not authenticated' }

  const title     = (formData.get('title') as string ?? '').trim()
  const url       = (formData.get('url') as string ?? '').trim()
  const is_public = formData.get('is_public') === 'on'

  if (!title) return { error: 'Title is required' }
  if (!url)   return { error: 'URL is required' }

  // Ensure URL has a protocol so href works correctly
  const fullUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`

  const { error } = await supabase.from('bookmarks').insert({
    user_id: user.id,  // always from server auth — never trust the client
    title,
    url: fullUrl,
    is_public,
  })

  if (error) {
    console.error('[CREATE BOOKMARK]', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { error: null, savedAt: Date.now() }
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateBookmark(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) return { error: 'Not authenticated' }

  const id        = (formData.get('id') as string ?? '').trim()
  const title     = (formData.get('title') as string ?? '').trim()
  const url       = (formData.get('url') as string ?? '').trim()
  const is_public = formData.get('is_public') === 'on'

  if (!id)    return { error: 'Bookmark ID is missing' }
  if (!title) return { error: 'Title is required' }
  if (!url)   return { error: 'URL is required' }

  const fullUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`

  const { error } = await supabase
    .from('bookmarks')
    .update({ title, url: fullUrl, is_public })
    .eq('id', id)
    .eq('user_id', user.id)  // security: scope to this user's rows only

  if (error) {
    console.error('[UPDATE BOOKMARK]', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { error: null, savedAt: Date.now() }
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteBookmark(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) return

  const id = (formData.get('id') as string ?? '').trim()
  if (!id) return

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)  // security: scope to this user's rows only

  if (error) {
    console.error('[DELETE BOOKMARK]', error)
    return
  }

  revalidatePath('/dashboard')
}
