'use client';

import { useEffect, useState } from 'react';

const aboutus = {
  id:`aboutus`,
  content:{
    pretitle: 'About Us',
    title: `Structural and civil engineering for residential buildings`,
    copy:<>Structural Melbourne specialises in structural and civil engineering for residential buildings. Our goal is to produce cost-effective, buildable designs and clear documentation that make construction straightforward for builders and owners.<br/><br/>We can deliver your complete engineering package - from soil reports through to final certification - all at competitive rates and with fast turnaround times.<br/><br/>We develop structural design solutions that are practical, economical and innovative, while meeting our clients' objectives and complying with all relevant Australian Standards. Where possible, we aim for outcomes that are both buildable and environmentally responsible.<br/><br/>We work across residential, commercial and light industrial projects, using modern analysis, design and drafting software. Our designs cover a wide range of materials including timber, structural steel, masonry, blockwork and reinforced concrete.<br/><br/>We look forward to working with you on your next project - welcome to Melbourne Structural!</>,
    bg:`images/blueprint.svg`,
  },
  style:{
    pretitle:`mt-3 text-charcoal uppercase`,
    title: `text-charcoal`,
    img: `h-48 w-80 m-auto object-contain white opacity-90 hover:grayscale-0 `,
    copy:`mt-8 text-charcoal`,
    bg:`opacity-10 w-5/6 object-cover object-center lg:object-right animate-[bounce_45s_linear_infinite]`,
  }
}

const items = [
  '/images/about-01.jpg',
  '/images/about-02.jpg',
  '/images/about-03.jpg',
  '/images/about-04.jpg',
  '/images/about-05.jpg',
  '/images/about-06.jpg',
];

const aboutUs = {
  copy: <>Structural Melbourne specialises in structural and civil engineering for residential buildings. Our goal is to produce cost-effective, buildable designs and clear documentation that make construction straightforward for builders and owners.<br/><br/>We can deliver your complete engineering package - from soil reports through to final certification - all at competitive rates and with fast turnaround times.<br/><br/>We develop structural design solutions that are practical, economical and innovative, while meeting our clients' objectives and complying with all relevant Australian Standards. Where possible, we aim for outcomes that are both buildable and environmentally responsible.<br/><br/>We work across residential, commercial and light industrial projects, using modern analysis, design and drafting software. Our designs cover a wide range of materials including timber, structural steel, masonry, blockwork and reinforced concrete.<br/><br/>We look forward to working with you on your next project - welcome to Melbourne Structural!</>,
}

export default function AboutUs() {

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 2000); // 4s per image – tweak as you like

    return () => clearInterval(interval);
  }, []);

  const prevIndex = (currentIndex - 1 + items.length) % items.length;

  return (
    <section className='relative isolate overflow-hidden px-6 sm:py-32 py-16 scroll-mt-16 lg:overflow-visible lg:px-0'  id='aboutus'>
      <div className='absolute inset-0 -z-10 overflow-hidden' // bg image
      >
        <img
            alt=''
            src={aboutus.content.bg}
            className={aboutus.style.bg}
          />
      </div>
       {/* copy */}
      <div className='mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10'>
        <div className='lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8'>
          <div className='lg:pr-4'>
            <div className='lg:max-w-lg'>
              <p data-aos='fade-up' className={aboutus.style.pretitle}>{aboutus.content.pretitle}</p>
              <h2 data-aos='fade-up' className={aboutus.style.title}>{aboutus.content.title}</h2>
              <p data-aos='fade-up' className={aboutus.style.copy}>
                {aboutUs.copy}
              </p>
            </div>
          </div>
        </div>
       
        <div className='-mt-12 -ml-12 p-0 lg:sticky lg:top-30 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden animate-float'>
          <div className='-mt-12 p-12 lg:sticky lg:top-30 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden '>
            <div
              data-aos='fade-in'
              className='
                relative
                w-3xl max-w-none sm:w-228
                overflow-hidden
                rounded-3xl
                border-[3cqw] lg:border-[2cqw] border-border
                bg-offwhite
                shadow-xl ring-1 ring-white/10
                outline outline-navy/10
                aspect-16/10'
            >
              <img
                key={`prev-${prevIndex}`}
                alt=''
                src={items[prevIndex]}
                className='absolute inset-0 h-full w-full object-cover z-10'
              />
              <img
                key={`curr-${currentIndex}`}
                alt=''
                src={items[currentIndex]}
                className='absolute inset-0 h-full w-full object-cover z-20 drop-shadow-xl/50 animate-slide-left'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
