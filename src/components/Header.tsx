'use client';

import Link from 'next/link';
import { useNewsletterModal } from '@/contexts/NewsletterModalContext';

export default function Header() {
  const { openModal } = useNewsletterModal();

  return (
    <header className="bg-gray-900 text-white">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold hover:text-gray-300">
            Denver Luxury Home Remodeling
          </Link>
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link href="/" className="hover:text-gray-300">
              Home Page
            </Link>
            <Link href="/blog/kitchen" className="hover:text-gray-300">
              Kitchen
            </Link>
            <Link href="/blog/bathroom" className="hover:text-gray-300">
              Bathroom
            </Link>
            <Link href="/blog/home" className="hover:text-gray-300">
              Home Remodel
            </Link>
            <Link href="/tips" className="hover:text-gray-300">
              Tips
            </Link>
            <button
              onClick={openModal}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
