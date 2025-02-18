import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  // Convert GitHub URL to raw URL
  const imageUrl = 'https://raw.githubusercontent.com/Vicsicard/imagecontent/main/onsite-blog-luxury-home-image-444444.jpg';

  return (
    <div className="relative h-[600px] w-full">
      {/* Background Image with Overlay */}
      <Image
        src={imageUrl}
        alt="Luxury Home Remodeling in Denver"
        fill
        className="object-cover"
        priority
        sizes="100vw"
        quality={90}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Denver Luxury Home Remodeling Blog
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Expert insights and inspiration for transforming your Denver home into a luxurious living space.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-black bg-white hover:bg-gray-100 transition-colors duration-200"
          >
            Start Your Remodeling Journey
          </Link>
        </div>
      </div>
    </div>
  );
}
