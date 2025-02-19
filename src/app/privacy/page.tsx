import { Metadata } from 'next';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Privacy Policy | Denver Luxury Home Remodeling',
  description: 'Our privacy policy outlines how we collect, use, and protect your information when you visit our website or use our services.',
  openGraph: {
    title: 'Privacy Policy | Denver Luxury Home Remodeling',
    description: 'Our privacy policy outlines how we collect, use, and protect your information when you visit our website or use our services.',
    url: 'https://luxuryhomeremodelingdenver.com/privacy',
    siteName: 'Denver Luxury Home Remodeling',
    locale: 'en_US',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert lg:prose-xl max-w-none">
          <p>Last updated: February 18, 2025</p>

          <h2>Introduction</h2>
          <p>
            At Denver Luxury Home Remodeling, we respect your privacy and are committed to protecting your personal information. This privacy policy explains how we collect, use, and safeguard your data when you visit our website.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We collect information that you voluntarily provide to us when you:
          </p>
          <ul>
            <li>Contact us through our website</li>
            <li>Subscribe to our newsletter</li>
            <li>Request a consultation</li>
            <li>Comment on our blog posts</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Respond to your inquiries</li>
            <li>Provide the services you request</li>
            <li>Send you relevant updates and information</li>
            <li>Improve our website and services</li>
          </ul>

          <h2>Information Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            We may use third-party services to analyze website traffic, process payments, or provide other services. These third parties have their own privacy policies governing the use of your information.
          </p>

          <h2>Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            If you have questions about our privacy policy or how we handle your information, please contact us at:
          </p>
          <p>
            Email: info@luxuryhomeremodelingdenver.com<br />
            Phone: (720) 555-0123
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
          </p>
        </div>
      </main>
    </div>
  );
}
