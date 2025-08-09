import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nurse Journey - Your Nursing Career Companion',
  description: 'Explore nursing positions, track your career progression, and get personalized insights for your nursing journey.',
  keywords: ['nursing', 'career', 'healthcare', 'jobs', 'compensation'],
  authors: [{ name: 'Nurse Journey Team' }],
  openGraph: {
    title: 'Nurse Journey',
    description: 'Your Nursing Career Companion',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
