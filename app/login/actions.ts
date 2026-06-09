'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { sendWelcomeEmail } from '@/app/actions/sendWelcomeEmail'

export type ActionState = { error: string | null }

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    console.error('[LOGIN ERROR]', error.message, error.status)
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

// ─── Signup ───────────────────────────────────────────────────────────────────

export async function signup(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email    = formData.get('email') as string
  const password = formData.get('password') as string
  const handle   = (formData.get('handle') as string ?? '').trim().toLowerCase()

  // 1. Validate handle format
  if (!handle) {
    return { error: 'Handle is required' }
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(handle)) {
    return { error: 'Handle may only contain letters, numbers, _ and -' }
  }

  // 2. Check handle availability — use admin client to bypass RLS
  //    Never trust a user_id from the client for this check.
  const admin = createAdminClient()
  const { data: existing, error: lookupError } = await admin
    .from('profiles')
    .select('id')
    .eq('handle', handle)
    .maybeSingle()

  if (lookupError) {
    console.error('[SIGNUP HANDLE LOOKUP ERROR]', lookupError)
    return { error: 'Could not verify handle availability — please try again' }
  }

  if (existing) {
    return { error: 'Handle already taken' }
  }

  // 3. Create the auth account
  const supabase = await createClient()
  const { data, error: signUpError } = await supabase.auth.signUp({ email, password })

  if (signUpError) {
    console.error('[SIGNUP ERROR]', signUpError.message, signUpError.status)
    return { error: signUpError.message }
  }

  // 4. Insert the profile — user.id comes from the signUp response, never from the client
  const user = data.user
  if (!user) {
    return { error: 'Sign up failed — please try again' }
  }

  const { error: profileError } = await admin
    .from('profiles')
    .insert({ id: user.id, handle })

  if (profileError) {
    console.error('[SIGNUP PROFILE INSERT ERROR]', profileError)
    return { error: 'Account created but profile setup failed — please contact support' }
  }

  // 5. Send welcome email — fire and don't await so it never blocks the redirect.
  //    Errors are caught internally inside sendWelcomeEmail.
  sendWelcomeEmail({ email, handle }).catch(() => {/* already logged inside */})

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('[SIGNOUT ERROR]', error.message)
    redirect(`/error?message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}
