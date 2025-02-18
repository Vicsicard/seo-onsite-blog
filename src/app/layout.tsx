import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from '@/components/ErrorBoundary';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Luxury Home Remodeling Blog | OnsiteProposal",
    template: "%s | OnsiteProposal",
  },
  description: "Explore high-end remodeling trends in Denver and get inspired with expert blog posts.",
  applicationName: 'OnsiteProposal Blog',
  authors: [{ name: 'OnsiteProposal Team' }],
  generator: 'Next.js',
  keywords: ['luxury home remodeling', 'Denver remodeling', 'home renovation', 'interior design', 'construction'],
  referrer: 'origin-when-cross-origin',
  creator: 'OnsiteProposal',
  publisher: 'OnsiteProposal',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://onsiteproposal.com',
    siteName: 'OnsiteProposal',
    title: {
      default: "Luxury Home Remodeling Blog",
      template: "%s | OnsiteProposal",
    },
    description: "Explore high-end remodeling trends in Denver and get inspired with expert blog posts.",
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'OnsiteProposal Blog',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: "Luxury Home Remodeling Blog",
      template: "%s | OnsiteProposal",
    },
    description: "Explore high-end remodeling trends in Denver and get inspired with expert blog posts.",
    creator: '@OnsiteProposal',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://onsiteproposal.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-gray-50 min-h-screen`}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Footer />
      </body>
    </html>
  );
}
