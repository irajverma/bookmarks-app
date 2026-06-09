import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form className="flex flex-col gap-4 w-full max-w-md p-8 bg-white rounded shadow-md dark:bg-zinc-900">
        <h1 className="text-2xl font-bold text-center">Login / Sign Up</h1>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
          />
        </div>
        <div className="flex gap-2">
          <button
            formAction={login}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Log in
          </button>
          <button
            formAction={signup}
            className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 dark:hover:bg-zinc-800"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  )
}
