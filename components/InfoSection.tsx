'use client'

import { useEffect, useState, ReactNode } from 'react';

type StyleOverrides = {
  pretitle?: string;
  title?: string;
  img?: string;
  copy?: string;
  bg?: string;
}

type Props = {
  id?: string;
  pretitle?: string;
  title: string;
  copy: ReactNode;
  bg?: string;
  images?: string[];
  intervalMs?: number; // time between image transitions in ms
  styleOverrides?: StyleOverrides;
}

const defaultItems = [
  '/images/about-01.jpg',
  '/images/about-02.jpg',
  '/images/about-03.jpg',
  '/images/about-04.jpg',
  '/images/about-05.jpg',
  '/images/about-06.jpg',
];

export default function InfoSection({
  id = 'infosection',
  pretitle = '',
  title,
  copy,
  bg = 'images/blueprint.svg',
  images = [],
  intervalMs = 3000,
  styleOverrides = {},
}: Props) {
  const items = images && images.length ? images : defaultItems;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [items.length, intervalMs]);

  const prevIndex = (currentIndex - 1 + items.length) % items.length;

  const style = {
    pretitle: styleOverrides.pretitle ?? 'mt-3 text-charcoal uppercase',
    title: styleOverrides.title ?? 'text-charcoal',
    img: styleOverrides.img ?? 'h-48 w-80 m-auto object-contain white opacity-90 hover:grayscale-0 ',
    copy: styleOverrides.copy ?? 'mt-8 text-charcoal',
    bg: styleOverrides.bg ?? 'opacity-10 w-5/6 object-cover object-center lg:object-right animate-[bounce_45s_linear_infinite]',
  };

  return (
    <section className='relative isolate overflow-hidden px-6 sm:py-32 py-16 scroll-mt-16 lg:overflow-visible lg:px-0' id={id}>
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <img alt='' src={bg} className={style.bg} />
      </div>

      <div className='mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10'>
        <div className='lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8'>
          <div className='lg:pr-4'>
            <div className='lg:max-w-lg'>
              {pretitle ? <p data-aos='fade-up' className={style.pretitle}>{pretitle}</p> : null}
              <h2 data-aos='fade-up' className={style.title}>{title}</h2>
              <div data-aos='fade-up' className={style.copy}>{copy}</div>
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
              <img alt='' src={items[prevIndex]} className='absolute inset-0 h-full w-full object-cover z-10' />
              <img key={currentIndex} alt='' src={items[currentIndex]} className='absolute inset-0 h-full w-full object-cover z-20 drop-shadow-xl/50 animate-slide-left' />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
