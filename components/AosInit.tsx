'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 500,      // animation duration in ms
      easing: 'ease-out',  // easing
      offset: 40,         // distance from bottom before triggering
      delay: 100,
    });
  }, []);

  return null;
}