import Link from 'next/link';

export default function BlogPostCTA() {
  return (
    <div className="mt-12 p-8 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl border border-white/10 backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-white mb-4">
        Looking for Home Remodelers in Denver?
      </h2>
      
      <p className="text-gray-200 mb-6 leading-relaxed">
        Top Contractors Denver connects you with the best local professionals for all your home remodeling needs, 
        from basement finishing and home additions to custom builds and historical restorations. 
        Our directory features highly rated contractors with proven expertise and excellent customer reviews.
      </p>

      <p className="text-gray-200 mb-6 leading-relaxed">
        At Top Contractors Denver, we make it easy to find trusted professionals near you. Explore our{' '}
        <a 
          href="https://www.topcontractorsdenver.com/" 
          className="text-blue-300 hover:text-blue-200 font-semibold transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Home Remodelers in Denver
        </a>{' '}
        page to view detailed profiles, read reviews, and request free quotes today.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
        <a 
          href="https://www.topcontractorsdenver.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors text-center"
        >
          Find a Contractor
        </a>
        
        <div className="text-gray-300">
          Questions? Email us at{' '}
          <a 
            href="mailto:info@topcontractorsdenver.com" 
            className="text-blue-300 hover:text-blue-200 transition-colors"
          >
            info@topcontractorsdenver.com
          </a>
        </div>
      </div>

      <p className="text-sm text-gray-400 mt-6">
        Discover why thousands of Denver homeowners trust Top Contractors Denver for finding top-rated contractors across all trades.
      </p>
    </div>
  );
}
