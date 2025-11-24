'use client'

import { useEffect, useState } from 'react';

import Link from 'next/link';

const home = { 
  id:`home`,
  content:{
    title: 'Practical structural engineering for builds all around Victoria.',
    subtitle: 'We help builders, architects and owners deliver safe, compliant residential and small commercial structures across Melbourne, Geelong, Bendigo and Ballarat.',
    video:`/video/hero.mp4`,
    poster:`/video/hero-bg.jpg`,
    cta1: 
      { copy:'Get a Quote',
        link: '#getaquote'
      },
    cta2:
      { copy:'Call Us Today',
        link: 'tel:+61458876290' 
      },
  },
  style:{
    title:`font-heading pb-6`,
    subtitle:`font-heading`,
    cta1:`rounded-full bg-yellow-400 px-5 py-2.5 font-semibold text-navy shadow-sm hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400`,
    cta2:`hover:underline`
  }
}

export default function Home() {
  const [arrowOpacity, setArrowOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const fadeStart = 0;    // px
      const fadeEnd = 40;    // px – adjust how quickly it fades

      const progress = (y - fadeStart) / (fadeEnd - fadeStart);
      const clamped = Math.max(0, Math.min(1, 1 - progress)); // 1 → 0

      setArrowOpacity(clamped);
    };

    handleScroll(); // run once on mount
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className='relative isolate flex min-h-screen items-center overflow-hidden bg-navy text-white'  aria-labelledby='hero-heading' id={home.id}>
      <div className='absolute inset-0' aria-hidden='true' //video background container
      >
        <video
          className='pointer-events-none absolute inset-0 h-full w-full object-cover z-0'
          autoPlay
          loop
          muted
          playsInline
          poster={home.content.poster} // optional fallback image
        >
        <source src={home.content.video} type='video/mp4'// Optional: fallback text
        />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className='absolute inset-0 bg-navy/70 z-0' // Dark overlay for contrast 
      />
      <div className='relative z-10 w-full mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24'>
        <div className='relative isolate px-6 pt-14 lg:px-8'>
          <div 
            data-aos='fade-up'
            className='mx-auto max-w-4xl py-0 sm:py-48 lg:py-0 text-left'
          >
            <h1 className={home.style.title}>
              {home.content.title}
            </h1>
            <h4 className={home.style.subtitle}>
              {home.content.subtitle}
            </h4>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <Link
                href={home.content.cta1.link}
                className={home.style.cta1}
              >
                {home.content.cta1.copy}
              </Link>
              <Link
                href={home.content.cta2.link}
                className={home.style.cta2}
              >
                {home.content.cta2.copy}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div
        data-aos='zoom-in-down'
        className='pointer-events-none absolute inset-x-0 bottom-6 flex justify-center transition-opacity duration-300'
        style={{ opacity: arrowOpacity }}
      >
        <svg
          className='h-7 w-7 text-white/70 animate-bounce'
          viewBox='0 0 24 24'
          fill='none'
          aria-hidden='true'
        >
          <path
            d='M6 9l6 6 6-6'
            stroke='currentColor'
            strokeWidth='1.6'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>

      </div>
    </section>
  )
}
