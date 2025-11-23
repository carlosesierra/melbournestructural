import Link from 'next/link';

// styles
const servicesStyle = {
  preTitleHeading:`mt-3 text-white/60 uppercase`,
  titleHeading:`mt-3 text-white`,
  subtitleHeading:`mt-1 text-charcoal`,
  title:`mt-1 text-charcoal`,
  copy:`mt-2 text-charcoal/80`,
  video:`pointer-events-none absolute inset-0 h-full w-full object-cover z-0`,
  poster:`pointer-events-none absolute inset-0 h-full w-full object-cover object-top z-0`,
}

// content
const servicesHeading = {
  preTitle: 'Services',
  title: 'Structural services for Australian projects.',
  subtitle: 'From investigations and design to certifications and reports.',
};

const services = [
  { title: 'Geotechnical engineering',
    copy: 'Site classifications, basements, commercial developments and infrastructure. Our Chartered geotechnical engineers can carry out the investigations and reporting your project requires.',
    video: '', 
    poster: '/images/services-01.png', 
  },
  { title: 'Structural design',
    copy: 'Residential, commercial and industrial structural design, computations and certification for new builds, extensions and alterations.',
    video: '/video/video-02.mp4', 
    poster: '/video/video-02.png',
  },
  { title: 'Forensic engineering',
    copy: 'Investigation of damaged structures using non-destructive testing (such as GPR) and destructive testing (core samples, footing exposures, lab testing) with clear repair recommendations.',
    video: '', 
    poster: '/images/services-03.png',
  },
  { title: 'Environmental engineering',
    copy: 'Contamination and soil testing for council permits and waste removal, with practical advice for builders and owners.',
    video: '/video/video-04.mp4', 
    poster: '/video/video-04.jpg',
  },
]


// component layout
export default function Services() {
  return (
    <section id='services' className='py-24 sm:py-32 bg-navy'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>

        <div className='mx-auto max-w-4xl text-left' //Section heading
        >
          <p className={servicesStyle.preTitleHeading}>{servicesHeading.preTitle}</p>
          <h2 className={servicesStyle.titleHeading}>{servicesHeading.title} </h2>
          <p className='mt-3 text-white/80'> {servicesHeading.subtitle} </p>
        </div>

        <div className='mt-12 grid gap-6 sm:mt-16 md:grid-cols-2' //Cards grid
        >

            {services.map((item) => (
              <div  className='relative' key={item.title}  //Card
              >
                <div className='absolute inset-px rounded-3xl bg-concrete' />
                <div className='relative flex h-full flex-col overflow-hidden rounded-3xl bg-white'>
                  <div className='px-8 pt-8 pb-4 sm:px-10 sm:pt-10 sm:pb-0'>
                    <h3 className={servicesStyle.title}>
                      {item.title}
                    </h3>
                    <p className={servicesStyle.copy}>
                      {item.copy}
                    </p>
                  </div>
                  <div className='@container relative min-h-120 w-full grow max-lg:mx-auto'>
                    <div className='absolute inset-x-10 top-10 bottom-10 overflow-hidden rounded-3xl border-[3cqw] border-border bg-offwhite outline outline-navy/10'>
                     {item.video ? (
                        <video
                          className={servicesStyle.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          poster={item.poster}
                        >
                          <source src={item.video} type='video/mp4' />
                          Your browser does not support the video tag.
                        </video>
                      ) : item.poster ? (
                        <img
                          alt={item.title}
                          src={item.poster}
                          className={servicesStyle.poster}
                          loading='lazy'
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className='pointer-events-none absolute inset-px rounded-3xl shadow-sm outline outline-navy/10' />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}