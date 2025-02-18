import Link from 'next/link';

export default function Header() {
  return (
    <header className="relative">
      {/* Background image with overlay */}
      <div className="absolute inset-0 h-64 w-full">
        <img
          src="https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-main-image-8888888888888.jpg"
          alt="Luxury home remodeling in Denver"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/60" />
      </div>

      {/* Header content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation bar */}
          <nav className="flex items-center justify-between py-6">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-white hover:text-accent transition-colors">
                Luxury Home Remodeling in Denver
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                <Link
                  href="/"
                  className="text-white hover:text-accent transition-colors font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/blog"
                  className="text-white hover:text-accent transition-colors font-medium"
                >
                  Blog
                </Link>
                <Link
                  href="/tips"
                  className="text-white hover:text-accent transition-colors font-medium"
                >
                  Jerome's Tips
                </Link>
              </div>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-white hover:text-accent focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
