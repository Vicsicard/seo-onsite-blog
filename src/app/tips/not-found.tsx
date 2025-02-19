import Header from '@/components/Header';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Tip Not Found</h1>
          <p className="text-xl">The requested tip could not be found.</p>
          {process.env.NODE_ENV === 'development' && (
            <p className="mt-4 text-gray-400">
              Check the console for more details about why this tip was not found.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
