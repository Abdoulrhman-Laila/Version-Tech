import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { contactAPI, handleApiError } from '../services/api';

/** `primary` + focus ring (tailwind.config); align with Register / index `.form-input` intent */
const inputClass =
  'w-full rounded-xl border border-primary-200/90 bg-primary-50 px-4 py-3 text-primary-900 shadow-sm shadow-primary-900/5 transition-all duration-300 placeholder:text-primary-500/45 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-primary-600/50 dark:bg-primary-900/45 dark:text-primary-50 dark:placeholder:text-primary-300/50 dark:shadow-none';

const labelClass =
  'mb-2 block text-sm font-semibold text-primary-800 dark:text-primary-100/95';

const infoIconWrap =
  'mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-primary-50 shadow-md shadow-primary-900/20 ring-2 ring-primary-500/25 dark:ring-primary-300/25';

const socialChipClass =
  'flex h-12 w-12 items-center justify-center rounded-full bg-primary-gradient text-primary-50 shadow-lg shadow-primary-900/35 ring-2 ring-primary-500/25 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary-900/50 hover:ring-primary-300/40';

const Contact = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await contactAPI.submit({
        ...formData,
        category: 'general',
      });

      toast.success(response.data.message || t('contact.form.success'));
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      const errorInfo = handleApiError(error);
      toast.error(errorInfo.message || t('contact.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: t('contact.info.address'),
      value: t('contact.info.addressValue'),
    },
    {
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: t('contact.info.phone'),
      value: t('contact.info.phoneValue'),
    },
    {
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: t('contact.info.email'),
      value: t('contact.info.emailValue'),
    },
    {
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t('contact.info.hours'),
      value: t('contact.info.hoursValue'),
    },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      href: '#',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: '#',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.936 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.329-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.412-3.329c.88-.88 2.032-1.297 3.329-1.297s2.448.417 3.329 1.297c.88.88 1.297 2.032 1.297 3.329s-.417 2.448-1.297 3.329c-.88.807-2.032 1.212-3.329 1.212zm7.83-7.83c-.49 0-.88-.39-.88-.88s.39-.88.88-.88.88.39.88.88-.39.88-.88.88zm0 0" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('seo.contact.title')}</title>
        <meta name="description" content={t('seo.contact.description')} />
      </Helmet>

      {/* Hero — `.gradient-text` (index.css) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100/95 to-primary-200/70 pt-24 pb-14 dark:from-primary-900 dark:via-primary-800 dark:to-primary-900 md:pt-28 md:pb-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(111,106,240,0.18),transparent)] dark:bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(77,59,255,0.14),transparent)]" />
        <div className="pointer-events-none absolute -right-24 top-16 h-64 w-64 rounded-full bg-primary-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-8 h-48 w-48 rounded-full bg-primary-600/12 blur-3xl" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-center"
          >
            <h1 className="gradient-text mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {t('contact.title')}
            </h1>
            <p className="mx-auto max-w-3xl text-lg font-medium text-primary-800/95 dark:text-primary-100/90 md:text-xl">
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Info cards */}
      <section className="section-padding bg-white/80 dark:bg-primary-900/35">
        <div className="container-custom">
          <div className="mb-0 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="card hover-lift rounded-2xl border border-primary-200/80 p-6 text-center dark:border-primary-700/50"
              >
                <div className={infoIconWrap}>{info.icon}</div>
                <h3 className="mb-2 font-semibold text-primary-900 dark:text-primary-50">{info.title}</h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-primary-700/95 dark:text-primary-200/85">
                  {info.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + map */}
      <section className="section-padding bg-primary-50/90 dark:bg-primary-900/45">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass card rounded-2xl border border-primary-200/80 p-6 shadow-soft dark:border-primary-600/40 md:p-8">
                <h2 className="gradient-text mb-8 text-2xl font-bold tracking-tight">
                  {t('contact.form.sendMessageTitle')}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className={labelClass}>
                        {t('contact.form.name')} *
                      </label>
                      <input
                        type="text"
                        id="contact-name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        placeholder={t('contact.form.namePlaceholder')}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className={labelClass}>
                        {t('contact.form.email')} *
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        placeholder={t('contact.form.emailPlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="contact-phone" className={labelClass}>
                        {t('contact.form.phone')}
                      </label>
                      <input
                        type="tel"
                        id="contact-phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder={t('contact.form.phonePlaceholder')}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className={labelClass}>
                        {t('contact.form.subject')} *
                      </label>
                      <input
                        type="text"
                        id="contact-subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        placeholder={t('contact.form.subjectPlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className={labelClass}>
                      {t('contact.form.message')} *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className={`${inputClass} resize-y min-h-[140px]`}
                      placeholder={t('contact.form.messagePlaceholder')}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                    className={`hover-lift flex w-full items-center justify-center gap-2 rounded-xl py-3.5 px-6 text-base font-semibold text-primary-50 shadow-medium ring-2 ring-primary-500/25 transition-all duration-300 dark:ring-primary-300/25 ${
                      isSubmitting
                        ? 'cursor-not-allowed bg-primary-600/70 opacity-80'
                        : 'bg-primary-gradient hover:shadow-lg'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-100 border-t-transparent" />
                        {t('contact.form.sending')}
                      </>
                    ) : (
                      t('contact.form.send')
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-2xl border border-primary-200/80 shadow-medium ring-1 ring-primary-300/20 dark:border-primary-600/50 dark:ring-primary-500/15"
              aria-label={t('contact.mapLabel')}
            >
              <iframe
                title={t('contact.mapTitle')}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.8640088379636!2d100.50176581526032!3d13.724906490352895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29edaa5a2f2ef%3A0xb317f9be6a5ee59!2sBangkok%2C%20Thailand!5e0!3m2!1sen!2sus!4v1621030171861!5m2!1sen!2sus"
                width="100%"
                height="450"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[min(450px,60vh)] min-h-[280px] w-full border-0"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social */}
      <section className="section-padding bg-white/80 dark:bg-primary-900/35">
        <div className="container-custom text-center">
          <h2 className="gradient-text mb-8 text-2xl font-bold tracking-tight md:text-3xl">
            {t('contact.followUs')}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                target="_blank"
                rel="noopener noreferrer"
                className={socialChipClass}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
