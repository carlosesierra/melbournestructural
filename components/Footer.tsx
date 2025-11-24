const today = new Date();
const thisYear = today.getFullYear();

const footer = {
    id: 'footer',
    style: {
        copy: 'mt-3 text-white/80',
    },
}

const items = [
  { copy: <>&copy; {thisYear} Melbourne Structural Pty Ltd Trading as Soil Test Melbourne ABN 47 644 792 852</> },
  { copy: <> - <a className='text-white' href='/doc/privacypolicy.pdf' target='_blank' rel='noopener'>privacy policy</a></> },
  { copy: <> - <a className='text-white' href='https://carlosesierra.com.au/' target='_blank' rel='noopener'>web design</a> by carlosesierra.com.au</> },
]

export default function Footer() {
  return (
    <>
    <div className='bg-navy py-6' id={footer.id}>
      <div className='mx-auto max-w-8xl px-6 lg:px-8'>
        <div className=''>
           {items.map((item, index) => (
              <small key={index}  className={footer.style.copy}>  {item.copy}
              </small>
           ))}
        </div>

      </div>
    </div>
    </>
  )
}
