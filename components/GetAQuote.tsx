'use client';

import { FormEvent, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';

const getaQuote = {
  id:'getaquote',
  content:{
    pretitle: 'Get a Quote',
    title: `Get in touch with Melbourne Structural`,
    subtitle: `Our team is ready to assist you with your structural engineering needs. `,
    form:{
      success: `Thanks. your message has been sent. We'll be in touch shortly.`,
      error: `Something went wrong sending your message. Please try again or email us directly.`,
    }
  },
  style:{
    pretitle:`mt-3 text-white/60 uppercase`,
    title: `text-white`,
    subtitle:`mt-3 text-white/80`,
    img: `h-48 w-80 m-auto object-contain white opacity-90 hover:grayscale-0 `,
    cta:`rounded-full bg-yellow-400 px-5 py-2.5 font-semibold text-navy shadow-sm hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 disabled:bg-gray-400 disabled:text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-gray-400`,
  },
  
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function GetAQuote() {

  const formRef = useRef<HTMLFormElement | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const [status, setStatus] = useState<Status>('idle');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!captchaToken) {
      setErrorMessage(`Please confirm you're not a robot.`);
      return;
    }

    if (!formRef.current) return;

    setStatus('loading');

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
        formRef.current,
        {
          publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
        }
      );

      setStatus('success');
      formRef.current.reset();
          setErrorMessage(null);

    if (!captchaToken) {
      setErrorMessage(`Please confirm you're not a robot.`);
      return;
    }

    } catch (error) {
      console.error('EmailJS error:', error);
      setStatus('error');
    }
  };

  return (

    <section className='py-24 sm:py-32 bg-navy' id={getaQuote.id}>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl text-left' //Section 
        >
        <p data-aos='fade-up' className={getaQuote.style.pretitle}>{getaQuote.content.pretitle}</p>
        <h2 data-aos='fade-up' className={getaQuote.style.title}>{getaQuote.content.title}</h2>
        <p data-aos='fade-up' className={getaQuote.style.subtitle}> {getaQuote.content.subtitle} </p>
        </div>

      <div className='grid gap-6 md:grid-cols-2' //Cards grid
        >

        <form  // Form 
          ref={formRef} 
          onSubmit={handleSubmit} 
          className='mx-auto mt-16 max-w-xl'>
          <div className='grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2' // fields
          >
            <div // name
             data-aos='fade-up'
            >
              <label 
                htmlFor='name' 
                className='block text-sm/6 font-semibold text-white'>
                Name
              </label>
              <div className='mt-2.5'>
                <input
                  id='name'
                  name='name'
                  type='text'
                    placeholder='Your name'
                  autoComplete='name'
                  required
                  className='block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-2 focus:outline-white'
                />
              </div>
            </div>

            <div // phone
             data-aos='fade-up'  
            >
              <label 
                htmlFor='phone' 
                className='block text-sm/6 font-semibold text-white'>
                Phone
              </label>
              <div className='mt-2.5'>
                <div className='flex rounded-md bg-white/5 outline-1 -outline-offset-1 outline-white/10 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-white'>
                  <input
                    id='phone'
                    name='phone'
                    type='tel'
                    placeholder='123-456-7890'
                    required
                    className='block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-2 focus:outline-white'
                  />
                </div>
              </div>
            </div>
            <div 
              data-aos='fade-up'
              className='sm:col-span-2' // email  
            >
              <label 
                htmlFor='email' 
                className='block text-sm/6 font-semibold text-white'>
                Email
              </label>
              <div className='mt-2.5'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='Your email address'
                  autoComplete='email'
                  required
                  className='block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-2 focus:outline-white'
                />
              </div>
            </div>
            <div 
               data-aos='fade-up'
              className='sm:col-span-2' // message  
            >
              <label 
                htmlFor='message' 
                className='block text-sm/6 font-semibold text-white'>
                Message
              </label>
              <div className='mt-2.5'>
                <textarea
                  id='message'
                  name='message'
                  rows={4}
                  defaultValue={''}
                  placeholder='Briefly describe the scope including any relevant information.'
                  required
                  className='block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-2 focus:outline-white'
                />
              </div>
            </div>
            <div 
               data-aos='fade-up'
              className='sm:col-span-2' // upload file  
            >
              <label 
                htmlFor='attachments' 
                className='block text-sm/6 font-semibold text-white'>
                Upload File (max 2MB)
              </label>
              <div className='mt-2.5'>
                <input
                  id='attachments'
                  name='attachments'
                  type='file'
                  className='block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-2 focus:outline-white'
                />
              </div>
            </div>

            {status === 'success' && ( // Status / feedback
              <p className='text-sm text-teal'>
                {/* Thanks — your message has been sent. We'll be in touch shortly. */}
                {getaQuote.content.form.success}
              </p>
            )}
            {status === 'error' && (
              <p className='text-sm text-red-600'>
                {/* Something went wrong sending your message. Please try again or email us directly. */}
                {getaQuote.content.form.error}
              </p>
            )}
        
          </div>
          <div 
            data-aos='fade-up'
            className='sm:col-span-2 mt-4' // Recaptcha  
          >
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
              onChange={(token) => {
                setCaptchaToken(token);
                setErrorMessage(null);
              }}
              onExpired={() => setCaptchaToken(null)}
            />
          </div>

          {errorMessage && (
            <p className='mt-3 text-sm text-red-500'>
              {errorMessage}
            </p>
          )}
          <div
            data-aos='fade-up' 
            className='mt-10'
          >
            <button
              type='submit'
              disabled={status === 'loading' || !captchaToken}
              className={getaQuote.style.cta}
            >
              {status === 'loading' ? 'Sending…' : 'Send message'}
            </button>
          </div>
        </form>
        <div 
          data-aos='flip-left'
          className='flex mt-16 '>
            <span className='sr-only'>melbourne Structural</span>
              <img
                alt=''
                src='/images/favicon.svg'
                className='h-80 w-full'
              />
          </div>
      </div>
      </div>
    </section>
  )
}
