import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from '@/components/ErrorBoundary';
import Footer from '@/components/Footer';
import { NewsletterModalProvider } from '@/contexts/NewsletterModalContext';
import NewsletterModal from '@/components/NewsletterModal';

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

export const metadata: Metadata = {
  metadataBase: new URL('https://luxuryhomeremodelingdenver.com'),
  title: {
    default: 'Denver Luxury Home Remodeling | Expert Renovation Services',
    template: '%s | Denver Luxury Home Remodeling',
  },
  description: 'Expert luxury home remodeling services in Denver. Transform your house with our professional renovation team specializing in kitchen, bathroom, and whole home remodels.',
  keywords: 'luxury home remodeling, denver home renovation, kitchen remodeling, bathroom renovation, home makeover, high-end renovation, custom home design',
  creator: 'Luxury Home Remodeling Denver',
  publisher: 'Luxury Home Remodeling Denver',
  authors: [{ name: 'Luxury Home Remodeling Denver Team', url: 'https://luxuryhomeremodelingdenver.com' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://luxuryhomeremodelingdenver.com',
    siteName: 'Denver Luxury Home Remodeling',
    title: 'Denver Luxury Home Remodeling | Expert Renovation Services',
    description: 'Expert luxury home remodeling services in Denver. Transform your house with our professional renovation team specializing in kitchen, bathroom, and whole home remodels.',
    images: [
      {
        url: '/images/onsite-blog-luxury-home-image-444444.jpg',
        width: 1200,
        height: 630,
        alt: 'Denver Luxury Home Remodeling',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Denver Luxury Home Remodeling | Expert Renovation Services',
    description: 'Expert luxury home remodeling services in Denver. Transform your house with our professional renovation team specializing in kitchen, bathroom, and whole home remodels.',
    images: ['/images/onsite-blog-luxury-home-image-444444.jpg'],
    creator: '@LuxuryHomeDenver',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
  appleWebApp: {
    title: 'Denver Luxury Home Remodeling',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
  formatDetection: {
    telephone: true,
    date: false,
    address: true,
    email: true,
    url: true,
  },
  verification: {
    google: 'google-site-verification=YOUR_CODE_HERE', // Replace with your verification code
  },
  category: 'home remodeling',
  alternates: {
    canonical: 'https://luxuryhomeremodelingdenver.com',
    languages: {
      'en-US': 'https://luxuryhomeremodelingdenver.com',
    },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Google Analytics 4 Implementation */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-MEASUREMENT_ID"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-MEASUREMENT_ID');
            `
          }}
        />
      </head>
      <body className="font-sans antialiased bg-gray-900 text-white min-h-screen">
        <NewsletterModalProvider>
          <ErrorBoundary>
            {children}
            <Footer />
            <NewsletterModal />
          </ErrorBoundary>
        </NewsletterModalProvider>
      </body>
    </html>
  );
}
