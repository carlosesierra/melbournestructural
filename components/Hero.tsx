'use client'

import Link from 'next/link';

const herosStyle = {
  titleHeading:`font-heading pb-6`,
  subtitleHeading:`font-heading`,
  cta1:`rounded-full bg-yellow-400 px-5 py-2.5 font-semibold text-navy shadow-sm hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400`,
  cta2:`text-white hover:underline`
}

const hero = { 
  title: 'Practical structural engineering for builds all around Victoria.',
  subtitle: 'We help builders, architects and owners deliver safe, compliant residential and small commercial structures across Melbourne, Geelong, Bendigo and Ballarat.',
  cta1: 
    { copy:'Get a Quote',
      link: '#'
    },
  cta2:
    { copy:'Call Us Today',
      link: 'tel:+61458876290' 
    },
  video:`/video/hero.mp4`,
  poster:`/video/hero-bg.jpg`,
}

export default function Hero() {
  return (
        <section aria-labelledby='hero-heading' className='relative isolate flex min-h-screen items-center overflow-hidden bg-navy text-white'>

          <div className='absolute inset-0' aria-hidden='true' //video background container
          >
            <video
                className='pointer-events-none absolute inset-0 h-full w-full object-cover z-0'
                autoPlay
                loop
                muted
                playsInline
                poster={hero.poster} // optional fallback image
              >
                <source src={hero.video} type='video/mp4'// Optional: fallback text
                />
                Your browser does not support the video tag.
              </video>
          </div>
      
      <div className='absolute inset-0 bg-navy/70 z-0' // Dark overlay for contrast 
      />

      <div className='relative z-10 w-full mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24'>

      <div className='relative isolate px-6 pt-14 lg:px-8'>
        <div className='mx-auto max-w-4xl py-0 sm:py-48 lg:py-0 text-left'>
            <h1 className={herosStyle.titleHeading}>
             {hero.title}
            </h1>
            <h4 className={herosStyle.subtitleHeading}>
              {hero.subtitle}
            </h4>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <Link
                href={hero.cta1.link}
                className={herosStyle.cta1}
              >
                {hero.cta1.copy}
              </Link>
               <Link
                href={hero.cta2.link}
                className={herosStyle.cta2}>
                {hero.cta2.copy}
              </Link>
            </div>
        </div>
      </div>
      </div>
    </section>
  )
}
