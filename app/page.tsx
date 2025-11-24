import Home from '@/components/Home';
import Services from '@/components/Services';
import TrustedBy from '@/components/TrustedBy';
import AboutUs from '@/components/AboutUs';
import GetAQuote from '@/components/GetAQuote';
import ContactUs from '@/components/ContactUs';


export default function Page() {
  return (
    <div>
        <Home />
        <Services />
        <TrustedBy />
        <AboutUs />
        <GetAQuote />
        <ContactUs />
    </div>
  );
}
