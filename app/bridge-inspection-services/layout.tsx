import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function BridgeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation forceBackground={true} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
