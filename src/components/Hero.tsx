import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  // Convert GitHub URL to raw URL
  const imageUrl = 'https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-main-image-8888888888888.jpg';

  return (
    <div className="relative min-h-[600px] flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt="Luxury home remodeling in Denver - Beautiful modern interior design"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Your Ultimate Guide to Luxury Home Remodeling in Denver
        </h1>
        
        <h2 className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
          Explore expert insights, contractor recommendations, and remodeling tips for Denver homeowners.
        </h2>

        <div className="flex justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-black bg-white hover:bg-gray-100 transition-colors duration-200"
          >
            Explore Our Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
