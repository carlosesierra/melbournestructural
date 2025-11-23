import type { Metadata } from 'next';
import { Open_Sans, Montserrat } from 'next/font/google';
import './globals.css';
import TopMenu from '@/components/TopMenu';

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'Melbourne Structural',
  description: 'Practical structural engineering services in Melbourne.',
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
        <TopMenu />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
