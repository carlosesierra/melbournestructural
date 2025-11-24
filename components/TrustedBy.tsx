const trustedby = {
  id: 'trustedby',
  content:{
    pretitle: 'Licenses & Certifications',
    title: `Trusted by leading industry bodies.`,
    copy: `We are certified by the Business Licensing Authority, the VBA and Engineering Australia. We are members of; Engineers Australia, Footing and Foundation Society, Australasian Land And Groundwater Association (ALGA), Environment Institute of Australia and New Zealand, Soil Science Australia.`,
  },
  style:{
    pretitle:`mt-3 text-white/60 uppercase`,
    title: `text-white`,
    subtitle:`mt-1 text-charcoal`,
    copy:`mt-2 text-white/80`,
    img: `h-48 w-80 m-auto object-contain white opacity-90 hover:grayscale-0 `,
  }
}

const items = [
  { alt:`Engineers Australia`,
    src:`/images/engineersaustralia.svg`,
    width:300,
    height:300,
  },
  { alt:`The Building and Plumbing Commission`,
    src:`/images/buildingandplumbing.svg`,
    width:300,
    height:158,
  },
  { alt:`Foundation & Footings Society`,
    src:`/images/foundation.svg`,
    width:300,
    height:158,
  },
  { alt:`Australasian Land & Groundwater Association`,
    src:`/images/alga.svg`,
    width:300,
    height:158,
  },
  { alt:`Environment Institute of Australia and New Zealand`,
    src:`/images/environment.svg`,
    width:300,
    height:158,
  },
  { alt:`Soil Science Australia`,
    src:`/images/soilscience.svg`,
    width:300,
    height:158,
  },
]

export default function TrustedBy() {
  return (
    <section className='bg-navy py-24 sm:py-32' id={trustedby.id}>
      <div className='mx-auto max-w-8xl px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl text-left'>
          <p data-aos='fade-up' className={trustedby.style.pretitle}>{trustedby.content.pretitle}</p>
          <h2 data-aos='fade-up' className={trustedby.style.title}>{trustedby.content.title}</h2>
          <p data-aos='fade-up' className={trustedby.style.copy}> {trustedby.content.copy} </p>
        </div>
        <div className='mt-20 grid gap-6 md:grid-cols-3'>
          {items.map((item) => (
            <img
              data-aos='fade-right'
              key={item.alt}
              alt={item.alt}
              src={item.src}
              width={item.width}
              height={item.height}
              className={trustedby.style.img}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
