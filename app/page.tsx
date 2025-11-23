import Hero from '@/components/Hero';
import Services from '@/components/Services';
import CertifiedBy from '@/components/CertifiedBy';
import AboutUs from '@/components/AboutUs';
import GetAQuote from '@/components/GetAQuote';


export default function Home() {
  return (
    <div>
        <Hero />
        <Services />
        <CertifiedBy />
        <AboutUs />
        <GetAQuote />
    </div>
  );
}
