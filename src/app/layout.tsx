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
  title: {
    template: '%s | Denver Luxury Home Remodeling',
    default: 'Denver Luxury Home Remodeling - Expert Tips & Inspiration'
  },
  description: "Explore high-end remodeling trends in Denver and get inspired with expert blog posts.",
  openGraph: {
    title: "Luxury Home Remodeling Blog | OnsiteProposal",
    description: "Explore high-end remodeling trends in Denver and get inspired with expert blog posts.",
    url: "https://onsiteproposal.com",
    siteName: "OnsiteProposal",
    locale: "en_US",
    type: "website",
    images: [{
      url: '/images/onsite-blog-luxury-home-image-444444.jpg',
      width: 1200,
      height: 630,
      alt: "OnsiteProposal Blog"
    }]
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-gray-900 text-white min-h-screen`}>
        <NewsletterModalProvider>
          <ErrorBoundary>
            {children}
            <Footer />
            <NewsletterModal />
          </ErrorBoundary>
        </NewsletterModalProvider>
        <script src="https://ahp-email-scheduler.vicsicard.workers.dev/module.js" async></script>
      </body>
    </html>
  );
}
