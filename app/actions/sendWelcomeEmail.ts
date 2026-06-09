'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail({
  email,
  handle,
}: {
  email: string
  handle: string
}): Promise<void> {
  try {
    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: `Welcome to Bookmarks, @${handle}!`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #09090b; color: #f4f4f5; border-radius: 16px;">
          <div style="font-size: 24px; font-weight: 800; margin-bottom: 8px;">Bookmarks Space 🔖</div>
          <hr style="border: none; border-top: 1px solid #27272a; margin: 16px 0;" />
          <h1 style="font-size: 20px; font-weight: 700; margin: 0 0 12px;">Welcome, @${handle}!</h1>
          <p style="color: #a1a1aa; line-height: 1.6; margin: 0 0 20px;">
            Your account is all set up. You can now save, organise, and share your favourite links with the world.
          </p>
          <p style="color: #a1a1aa; line-height: 1.6; margin: 0 0 24px;">
            Your public profile is already live at:
          </p>
          <a
            href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/${handle}"
            style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #2563eb, #4f46e5); color: #fff; font-weight: 600; text-decoration: none; border-radius: 10px; font-size: 14px;"
          >
            View your profile → /${handle}
          </a>
          <p style="color: #52525b; font-size: 12px; margin-top: 32px;">
            You're receiving this because you just signed up for Bookmarks Space.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('[WELCOME EMAIL ERROR]', error)
    } else {
      console.log(`[WELCOME EMAIL] Sent to ${email} (@${handle})`)
    }
  } catch (err) {
    // Never block signup — log and swallow
    console.error('[WELCOME EMAIL UNEXPECTED ERROR]', err)
  }
}
