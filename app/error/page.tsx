export default function ErrorPage({
  searchParams,
}: {
  searchParams: { message?: string }
}) {
  const message = searchParams.message

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-lg w-full mx-4">
        <h1 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
          Something went wrong
        </h1>
        {message && (
          <p className="text-sm text-red-600 dark:text-red-300 font-mono bg-red-100 dark:bg-red-900/40 p-3 rounded">
            {message}
          </p>
        )}
        <a
          href="/login"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          ← Back to login
        </a>
      </div>
    </div>
  )
}
