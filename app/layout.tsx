import type { Metadata } from 'next';
import { Open_Sans, Montserrat } from 'next/font/google';
import './globals.css';
import AOSInit from '@/components/AosInit';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'Structural Civil Engineering - Structural Melbourne',
  description: 'Melbourne Structural provides structural and civil engineering services, designing innovative, economic & environmentally sustainable solutions.',
  icons: {
    icon: '/images/favicon.svg', // Relative path to your icon
    apple: '/images/favicon.svg', // For Apple devices
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${openSans.variable} ${montserrat.variable} data-scroll-behavior='smooth'`}
    >
      <body className='font-sans bg-offwhite text-charcoal'>
        <AOSInit />
        <Navigation />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
