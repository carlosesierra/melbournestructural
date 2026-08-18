import { NavProvider } from '@/components/NavContext';

export default function BridgeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NavProvider forceBackground={true}>
      {children}
    </NavProvider>
  );
}
