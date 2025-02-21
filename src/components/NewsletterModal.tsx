'use client';

import { useNewsletterModal } from '@/contexts/NewsletterModalContext';
import NewsletterSignup from './NewsletterSignup';

export default function NewsletterModal() {
  const { isOpen, closeModal } = useNewsletterModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute -top-2 -right-2 bg-gray-800 text-gray-400 hover:text-white rounded-full p-2 z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Newsletter form */}
        <div onClick={(e) => e.stopPropagation()}>
          <NewsletterSignup onSuccess={closeModal} />
        </div>
      </div>
    </div>
  );
}
