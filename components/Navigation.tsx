'use client'

import Link from 'next/link';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

const navigation = {
  content:{
    logo:{
      copy:`Melbourne Structural`,
      img:`/images/logo-horizontal.svg`,
      href:`https://www.melbournestructural.com.au/`,
    },
    phone:{
      copy:`Call Us Today: 04 58 876 290`,
      href:`tel:+61458876290`,
    }
  },
  style:{
    logo:`h-8 w-auto`,
    logolink:`-m-1.5 p-1.5`,
    links:`text-sm/6 font-normal text-white hover:underline`,
    linksmob:`-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5`,
  }
}

const items = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'Trusted By', href: '#trustedby' },
  { name: 'About Us', href: '#aboutus' },
  { name: 'Get A Quote', href: '#getaquote' },
  { name: 'Contact Us', href: '#contactus' },
]

function useScrolled(threshold = 40) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > threshold; // only update state when the *value* changes
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll(); // run once on mount
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return isScrolled;
}

export default function TopMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isScrolled = useScrolled(40);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${ isScrolled ? 'bg-gray-900/80 md:bg-gray-900/80 md:backdrop-blur border-b border-white/10' : 'bg-transparent' }`}>
      <nav aria-label='Global' className='flex items-center justify-between p-6 lg:px-8' >
        <div className='flex lg:flex-1' //logo
        >
            <Link 
            data-aos='fade-right'
            href={navigation.content.logo.href}
            className={navigation.style.logolink}>
                <span className='sr-only'>{navigation.content.logo.copy}</span>
                <img
                    alt={navigation.content.logo.copy}
                    src={navigation.content.logo.img}
                    className={navigation.style.logo}
                />
            </Link>
        </div>
        <div className='flex lg:hidden'>
            <button
            type='button'
            onClick={() => setMobileMenuOpen(true)}
            className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200'
            >
            <span className='sr-only'>Open main menu</span>
            <Bars3Icon aria-hidden='true' className='size-6' />
            </button>
        </div>
        <div className='hidden lg:flex lg:gap-x-12'>
            {items.map((item) => (
              <Link 
                data-aos='fade-down'
                key={item.name} 
                href={item.href} 
                className={navigation.style.links}>
                {item.name}
              </Link>
            ))}
        </div>
        <div className='hidden lg:flex lg:flex-1 lg:justify-end'>
            <Link 
              data-aos='fade-left'
              href={navigation.content.phone.href}
              className={navigation.style.links}
            >
            {navigation.content.phone.copy}
            </Link>
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className='lg:hidden' //Backdrop with fade
      >
        <div
          aria-hidden='true'
          className=' fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ease-out data-closed:opacity-0 '
        />
        <div className='fixed inset-0 z-50' //Sliding panel 
        />
        <DialogPanel
            transition
            className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10 transition-transform duration-300 ease-out data-closed:translate-x-full '
          >
          <div className='flex items-center justify-between'>
              <Link href='#' className='-m-1.5 p-1.5'>
                <span className='sr-only'>{navigation.content.logo.copy}</span>
                <img
                  alt=''
                  src='/images/favicon.svg'
                  className='h-8 w-auto'
                />
              </Link>
              <button
                type='button'
                onClick={closeMobileMenu}
                className='-m-2.5 rounded-md p-2.5 text-gray-200'
              >
                <span className='sr-only'>Close menu</span>
                <XMarkIcon aria-hidden='true' className='size-6' />
              </button>
            </div>

          <div className='mt-6 flow-root'>
            <div className='-my-6 divide-y divide-white/10'>
              <div className='space-y-2 py-6'>
                {items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={navigation.style.linksmob}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className='py-6'>
                <Link
                  href={navigation.content.phone.href}
                  onClick={closeMobileMenu}
                  className={navigation.style.linksmob}
                >
                  {navigation.content.phone.copy}
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}