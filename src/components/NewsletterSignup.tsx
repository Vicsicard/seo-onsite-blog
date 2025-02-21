'use client';

import { useState } from 'react';

function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

interface NewsletterSignupProps {
  onSuccess?: () => void;
}

export default function NewsletterSignup({ onSuccess }: NewsletterSignupProps) {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    if (!validateEmail(email)) {
      return;
    }

    if (!acceptedTerms) {
      setError('Please accept the privacy policy to continue');
      return;
    }

    setState('submitting');
    
    const data = {
      email,
      'first name': formData.get('first_name'),
      'last name': formData.get('last_name'),
      'signup date': new Date().toISOString(),
      source: 'homepage'
    };

    try {
      const response = await fetch('https://hook.us1.make.com/y5rn39c88u4gqwib1si82nbp8wxo7m1k', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to subscribe');
      setState('success');
      onSuccess?.();
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <div className="text-center">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 className="text-xl font-semibold text-white mb-2">Thank You for Subscribing!</h4>
        <p className="text-gray-300">
          You'll receive Jerome's expert insights and tips in your inbox soon.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-6 text-center">Subscribe to Jerome's Newsletter</h3>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            onChange={(e) => validateEmail(e.target.value)}
            className={`w-full p-2.5 sm:p-3 rounded bg-gray-700 border text-white placeholder-gray-400
                       transition-colors duration-200 ${
                         emailError 
                           ? 'border-red-500 focus:ring-red-500' 
                           : 'border-gray-600 focus:ring-blue-500'
                       } focus:outline-none focus:ring-2 focus:border-transparent`}
            required
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-400">{emailError}</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            className="w-full p-2.5 sm:p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-colors duration-200"
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            className="w-full p-2.5 sm:p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-colors duration-200"
            required
          />
        </div>
        
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="privacy-policy"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
          />
          <label htmlFor="privacy-policy" className="text-xs sm:text-sm text-gray-300">
            I agree to receive newsletters and accept the{' '}
            <a href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">
              privacy policy
            </a>
          </label>
        </div>

        <button
          type="submit"
          disabled={state === 'submitting'}
          className="w-full bg-blue-600 text-white p-2.5 sm:p-3 rounded-full font-semibold text-sm sm:text-base
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transform transition-all duration-200 hover:scale-[1.02]"
        >
          {state === 'submitting' ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subscribing...
            </span>
          ) : 'Subscribe to Newsletter'}
        </button>
      </form>
      {error && (
        <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-xs sm:text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
