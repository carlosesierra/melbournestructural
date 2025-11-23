const certifiedbyStyle = {
  preTitleHeading:`mt-3 text-white/60 uppercase`,
  title: `text-white`,
  subtitleHeading:`mt-1 text-charcoal`,
  img: `h-48 w-80 m-auto object-contain white opacity-90 hover:grayscale-0 `,
}

const certifiedbyHeading = {
  preTitle: 'Licenses & Certifications',
  title: `Trusted by leading industry bodies.`,
  subtitle: `We are certified by the Business Licensing Authority, the VBA and Engineering Australia. We are members of; Engineers Australia, Footing and Foundation Society, Australasian Land And Groundwater Association (ALGA), Environment Institute of Australia and New Zealand, Soil Science Australia.`,
}


const certifiedby = [
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

export default function CertifiedBy() {
  return (
    <div className='bg-navy py-24 sm:py-32'>
      <div className='mx-auto max-w-8xl px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl text-left'>
        <p className={certifiedbyStyle.preTitleHeading}>{certifiedbyHeading.preTitle}</p>
        <h2 className={certifiedbyStyle.title}>{certifiedbyHeading.title}</h2>
          <p className='mt-3 text-white/80'> {certifiedbyHeading.subtitle} </p>
        </div>
        <div className='mt-20 grid gap-6 md:grid-cols-3'>

          {certifiedby.map((item) => (
              <img 
                key={item.alt}
                alt={item.alt}
                src={item.src}
                width={item.width}
                height={item.height}
                className={certifiedbyStyle.img}
              />

            ))}
        </div>
      </div>
    </div>
  )
}
