import Link from 'next/link';

export default function Header() {
  const mainNavigation = [
    { name: 'Kitchen', href: '/blog/kitchen' },
    { name: 'Bathroom', href: '/blog/bathroom' },
    { name: 'Home', href: '/blog/home' },
    { name: 'Tips', href: '/tips' },
  ];

  const secondaryNavigation = [
    { name: 'About', href: '/about' },
    { name: 'Privacy', href: '/privacy' },
  ];

  return (
    <header className="relative">
      <nav className="bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-white font-bold text-xl">
                Denver Luxury
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {/* Main Navigation */}
              <div className="flex items-center space-x-8">
                {mainNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-white hover:text-accent transition-colors font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="h-5 w-px bg-gray-600"></div>

              {/* Secondary Navigation */}
              <div className="flex items-center space-x-6">
                {secondaryNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {mainNavigation.concat(secondaryNavigation).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
