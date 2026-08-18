'use client';

import InfoSection from './InfoSection';

const aboutContent = {
  id: 'aboutus',
  pretitle: 'About Us',
  title: `Structural and civil engineering for residential buildings`,
  copy: (
    <>
      Structural Melbourne specialises in structural and civil engineering for residential buildings. Our
      goal is to produce cost-effective, buildable designs and clear documentation that make construction
      straightforward for builders and owners.
      <br />
      <br />
      We can deliver your complete engineering package - from soil reports through to final certification - all
      at competitive rates and with fast turnaround times.
      <br />
      <br />
      We develop structural design solutions that are practical, economical and innovative, while meeting our
      clients’ objectives and complying with all relevant Australian Standards. Where possible, we aim for
      outcomes that are both buildable and environmentally responsible.
      <br />
      <br />
      We work across residential, commercial and light industrial projects, using modern analysis, design and
      drafting software. Our designs cover a wide range of materials including timber, structural steel,
      masonry, blockwork and reinforced concrete.
      <br />
      <br />
      We look forward to working with you on your next project - welcome to Melbourne Structural!
    </>
  ),
  bg: 'images/blueprint.svg',
  images: [
    '/images/about-01.jpg',
    '/images/about-02.jpg',
    '/images/about-03.jpg',
    '/images/about-04.jpg',
    '/images/about-05.jpg',
    '/images/about-06.jpg',
  ],
};

export default function AboutUs() {
  return (
    <InfoSection
      id={aboutContent.id}
      pretitle={aboutContent.pretitle}
      title={aboutContent.title}
      copy={aboutContent.copy}
      bg={aboutContent.bg}
      images={aboutContent.images}
    />
  );
}
