'use client';

import Header from '@/components/Header';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Error Loading Tip</h1>
          <p className="text-xl mb-8">Unable to load the requested tip. Please try again later.</p>
          <button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            Try Again
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-8 p-4 bg-gray-800 rounded text-left overflow-auto text-sm">
              {error.message}
            </pre>
          )}
        </div>
      </main>
    </div>
  );
}
