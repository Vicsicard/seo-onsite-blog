import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold hover:text-gray-300">
            Denver Luxury Home Remodeling
          </Link>
          <div className="space-x-6">
            <Link href="/blog/kitchen" className="hover:text-gray-300">
              Kitchen
            </Link>
            <Link href="/blog/bathroom" className="hover:text-gray-300">
              Bathroom
            </Link>
            <Link href="/blog/home" className="hover:text-gray-300">
              Home
            </Link>
            <Link href="/tips" className="hover:text-gray-300">
              Tips
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
