'use client';

import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  QUOTE_ATTACHMENT_ACCEPT,
  QUOTE_ATTACHMENT_HELP_TEXT,
  validateQuoteAttachment,
} from '@/lib/get-a-quote';

const submitTimeoutMs = (() => {
  const parsed = Number(process.env.NEXT_PUBLIC_CONTACT_SUBMIT_TIMEOUT_MS ?? '15000');

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 15000;
})();

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const [status, setStatus] = useState<Status>('idle');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const resetFeedback = () => {
    if (status !== 'idle') {
      setStatus('idle');
    }

    if (feedbackMessage) {
      setFeedbackMessage(null);
    }
  };

  const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    resetFeedback();

    const [file] = Array.from(event.currentTarget.files ?? []);
    const result = validateQuoteAttachment(file ?? null);

    if (!result.error) {
      return;
    }

    event.currentTarget.value = '';
    setStatus('error');
    setFeedbackMessage(result.error);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackMessage(null);

    if (!captchaToken) {
      setStatus('error');
      setFeedbackMessage(`Please confirm you're not a robot.`);
      return;
    }

    if (!formRef.current) return;

    const attachmentResult = validateQuoteAttachment(
      fileInputRef.current?.files?.[0] ?? null
    );

    if (attachmentResult.error) {
      setStatus('error');
      setFeedbackMessage(attachmentResult.error);
      return;
    }

    setStatus('loading');
    const submitAbortController = new AbortController();
    const submitTimeoutId = window.setTimeout(() => {
      submitAbortController.abort();
    }, submitTimeoutMs);

    try {
      const formData = new FormData(formRef.current);
      formData.set('captchaToken', captchaToken);

      const response = await fetch('/api/get-a-quote', {
        method: 'POST',
        signal: submitAbortController.signal,
        body: formData,
      });

      const responseData = (await response.json().catch(() => null)) as
        | { error?: string; success?: boolean }
        | null;

      if (!response.ok || responseData?.success !== true) {
        setStatus('error');
        setFeedbackMessage(responseData?.error ?? getaQuote.content.form.error);
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
        return;
      }

      setStatus('success');
      setFeedbackMessage(getaQuote.content.form.success);
      formRef.current.reset();
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    } catch (error) {
      console.error('Form submit error:', error);
      setStatus('error');
      if (error instanceof Error && error.name === 'AbortError') {
        setFeedbackMessage('Request timed out. Please try again.');
      } else {
        setFeedbackMessage(getaQuote.content.form.error);
      }
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      window.clearTimeout(submitTimeoutId);
      submitAbortController.abort();
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
                  onChange={resetFeedback}
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
                  onChange={resetFeedback}
                  autoComplete='tel'
                  inputMode='tel'
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
                  onChange={resetFeedback}
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
                  onChange={resetFeedback}
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
                  ref={fileInputRef}
                  accept={QUOTE_ATTACHMENT_ACCEPT}
                  onChange={handleAttachmentChange}
                  aria-describedby='attachments-help'
                  className='block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-2 focus:outline-white'
                />
                <p
                  id='attachments-help'
                  className='mt-2 text-sm text-white/70'
                >
                  {QUOTE_ATTACHMENT_HELP_TEXT}
                </p>
              </div>
            </div>
            <label className='sr-only' aria-hidden='true'>
              Website
              <input
                type='text'
                name='website'
                tabIndex={-1}
                autoComplete='off'
                onChange={resetFeedback}
              />
            </label>
        
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
                setFeedbackMessage(null);
                if (status === 'error') {
                  setStatus('idle');
                }
              }}
              onExpired={() => {
                setCaptchaToken(null);
                setStatus('error');
                setFeedbackMessage('reCAPTCHA expired. Please confirm it again.');
              }}
            />
          </div>

          {feedbackMessage && (
            <p
              className={`mt-3 text-sm ${status === 'success' ? 'text-teal' : 'text-red-500'}`}
              role='status'
              aria-live='polite'
            >
              {feedbackMessage}
            </p>
          )}
          <div
            data-aos='fade-up' 
            className='mt-10'
          >
            <button
              type='submit'
              disabled={status === 'loading'}
              aria-busy={status === 'loading'}
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
