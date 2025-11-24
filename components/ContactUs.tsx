import Link from 'next/link';

const contactus = {
  id:`contactus`,
  content:{
    pretitle: 'Contact Us',
    title: 'We are Melbourne based',
    copy:`Serving Greater Melbourne, Geelong, Bendigo, Ballarat and the whole of Victoria, Australia.`,
    bg:`images/melbourne.jpg`,
  },
  style:{
    pretitle:`mt-3 uppercase`,
    title:``,
    copy:`mt-2`,
    bg:`absolute inset-0 -z-10 size-full object-cover object-top grayscale opacity-20`,
    links:`text-charcoal`
  }
}

const items = [

{ name: 'Address', copy:`65 Newlands Road, Coburg North VIC 3058`, href:`https://share.google/MR7vOysqMnK05a3At` },
{ name: 'Phone', copy:`0458 876 290`, href:`tel:+61458876290` },
{ name: 'Email', copy:`info@structuralmelbourne.com.au`, href:`mailto:info@structuralmelbourne.com.au` },

]

export default function ContactUs() {
  return (
   <section className='relative isolate overflow-hidden px-6 py-24 sm:py-32' id={contactus.id}>
      <div className='absolute inset-0 -z-10 overflow-hidden' // bg image
      >
        <img
            alt=''
            src={contactus.content.bg}
            className={contactus.style.bg}
          />
      </div>
      <div className='mx-auto max-w-7xl lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 lg:px-8'>
        <div className='max-w-2xl lg:max-w-lg'>

              <p data-aos='fade-up' className={contactus.style.pretitle}>{contactus.content.pretitle}</p>
              <h2 data-aos='fade-up' className={contactus.style.title}>{contactus.content.title}</h2>
              <p data-aos='fade-up' className={contactus.style.copy}>{contactus.content.copy}</p>

              <div className='pt-3'>

              {items.map((item) => (
                  <p data-aos='fade-right' key={item.name} className={contactus.style.copy}>
                    <b>{item.name}: </b> 
                    <Link 
                    key={item.name} 
                    href={item.href} 
                    className={contactus.style.links} target='_blank'>
                    {item.copy}
                    </Link>
                  </p >
              ))}
              </div>

        </div>
      </div>
    </section>
 )
}
