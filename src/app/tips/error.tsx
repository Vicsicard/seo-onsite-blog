'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function TipsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[TipsError]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Unable to Load Tips</h1>
          <p className="text-gray-300 mb-8">
            We're having trouble loading Jerome's tips. This could be due to a temporary connection issue.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-100 transition-colors duration-200"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors duration-200"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
