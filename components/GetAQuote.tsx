'use client';

import { FormEvent, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';

const getaQuote = {
  style:{
    preTitleHeading:`mt-3 text-white/60 uppercase`,
    titleHeading: `text-white`,
    subtitleHeading:`mt-3 text-white/80`,
    img: `h-48 w-80 m-auto object-contain white opacity-90 hover:grayscale-0 `,
    cta:`rounded-full bg-yellow-400 px-5 py-2.5 font-semibold text-navy shadow-sm hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 disabled:bg-gray-400 disabled:text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-gray-400`,
  },
  preTitleHeading: 'Get a Quote',
  titleHeading: `Get in touch with Melbourne Structural`,
  subtitleHeading: `Our team is ready to assist you with your structural engineering needs. `,
  formSuccessMessage: `Thanks. your message has been sent. We'll be in touch shortly.`,
  formErrorMessage: `Something went wrong sending your message. Please try again or email us directly.`,
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
    <div id='contact' className='isolate bg-navy px-6 py-24 sm:py-32 lg:px-8'>
      <div className='mx-auto max-w-2xl text-center' // Heading
      >
        <p className={getaQuote.style.preTitleHeading}>{getaQuote.preTitleHeading}</p>
        <h2 className={getaQuote.style.titleHeading}>{getaQuote.titleHeading}</h2>
        <p className={getaQuote.style.subtitleHeading}> {getaQuote.subtitleHeading} </p>
      </div>
      <form  // Form 
        ref={formRef} 
        onSubmit={handleSubmit} 
        className='mx-auto mt-16 max-w-xl sm:mt-20'>
        <div className='grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2' // Form fields
        >
          <div // Form name
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
                required
                autoComplete='name'
                className='block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500'
              />
            </div>
          </div>

          <div // Form phone  
          >
            <label 
              htmlFor='phone' 
              className='block text-sm/6 font-semibold text-white'>
              Phone
            </label>
            <div className='mt-2.5'>
              <div className='flex rounded-md bg-white/5 outline-1 -outline-offset-1 outline-white/10 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-500'>
                <input
                  id='phone'
                  name='phone'
                  type='tel'
                  placeholder='123-456-7890'
                  className='block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500'
                />
              </div>
            </div>
          </div>
          <div className='sm:col-span-2'>
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
                required
                autoComplete='email'
                className='block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500'
              />
            </div>
          </div>
          <div className='sm:col-span-2'>
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
                className='block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500'
                defaultValue={''}
                placeholder='Briefly describe the scope including any relevant information.'
              />
            </div>
          </div>
          <div className='sm:col-span-2'>
            <label 
              htmlFor='attachments' 
              className='block text-sm/6 font-semibold text-white'>
              Upload File (max 500KB)
            </label>
            <div className='mt-2.5'>
              <input
                id='attachments'
                name='attachments'
                type='file'
                className='block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500'
              />
            </div>
          </div>

          {status === 'success' && ( // Status / feedback
            <p className='text-sm text-teal'>
              {/* Thanks — your message has been sent. We'll be in touch shortly. */}
              {getaQuote.formSuccessMessage}
            </p>
          )}
          {status === 'error' && (
            <p className='text-sm text-red-600'>
              {/* Something went wrong sending your message. Please try again or email us directly. */}
              {getaQuote.formErrorMessage}
            </p>
          )}
      
        </div>
        <div className='sm:col-span-2 mt-4'>
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
        <div className='mt-10'>
          <button
            type='submit'
            disabled={status === 'loading' || !captchaToken}
            className={getaQuote.style.cta}
          >
            {status === 'loading' ? 'Sending…' : 'Send message'}
          </button>
        </div>
      </form>
    </div>
  )
}
