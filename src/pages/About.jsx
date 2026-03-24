import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const values = [
    {
      key: 'quality',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      key: 'innovation',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      key: 'excellence',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      key: 'commitment',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('seo.about.title')}</title>
        <meta name="description" content={t('seo.about.description')} />
      </Helmet>

      {/* Hero — primary + index.css `.gradient-text` */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100/95 to-primary-200/70 pt-24 pb-16 dark:from-primary-900 dark:via-primary-800 dark:to-primary-900 md:pt-28 md:pb-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(111,106,240,0.18),transparent)] dark:bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(77,59,255,0.15),transparent)]" />
        <div className="pointer-events-none absolute -right-20 top-20 h-56 w-56 rounded-full bg-primary-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-10 h-40 w-40 rounded-full bg-primary-600/10 blur-3xl" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="gradient-text mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {t('about.title')}
            </h1>
            <p className="mx-auto max-w-3xl text-lg font-medium text-primary-800/95 dark:text-primary-100/90 md:text-xl">
              {t('about.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white/80 dark:bg-primary-900/35">
        <div className="container-custom">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-primary-900 dark:text-primary-50 md:text-4xl">
                {t('about.storyTitle', 'قصتنا')}
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-primary-800/95 dark:text-primary-200/90">
                {t('about.description')}
              </p>
              <p className="text-lg leading-relaxed text-primary-700/95 dark:text-primary-200/85">
                {t('about.additionalText')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="relative"
            >
              <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-3xl bg-primary-gradient p-10 shadow-medium ring-2 ring-primary-500/25 dark:ring-primary-400/20 md:min-h-[320px]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
                <div className="relative text-center">
                  <div className="text-5xl font-extrabold text-primary-50 drop-shadow-md md:text-6xl lg:text-7xl">
                    5+
                  </div>
                  <p className="mt-3 max-w-xs text-base font-medium leading-snug text-primary-100/95">
                    {t('stat.years')}
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute -bottom-6 -right-6 -z-10 h-36 w-36 rounded-full bg-primary-400/20 blur-3xl dark:bg-primary-600/25" />
              <div className="pointer-events-none absolute -left-6 -top-6 -z-10 h-28 w-28 rounded-full bg-primary-300/25 blur-3xl dark:bg-primary-500/20" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission — `.glass` + `bg-primary-gradient` icons */}
      <section ref={ref} className="section-padding bg-primary-50/90 dark:bg-primary-900/45">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10"
          >
            <motion.div
              variants={fadeInUp}
              className="glass rounded-2xl border border-primary-200/80 p-8 text-center shadow-soft dark:border-primary-600/40 md:p-10"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-primary-50 shadow-md ring-2 ring-primary-500/25">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-primary-900 dark:text-primary-50">
                {t('about.vision.title')}
              </h3>
              <p className="leading-relaxed text-primary-800/95 dark:text-primary-200/88">
                {t('about.vision.description')}
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="glass rounded-2xl border border-primary-200/80 p-8 text-center shadow-soft dark:border-primary-600/40 md:p-10"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-primary-50 shadow-md ring-2 ring-primary-500/25">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-primary-900 dark:text-primary-50">
                {t('about.mission.title')}
              </h3>
              <p className="leading-relaxed text-primary-800/95 dark:text-primary-200/88">
                {t('about.mission.description')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white/80 dark:bg-primary-900/35">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-14 text-center md:mb-16"
          >
            <h2 className="gradient-text mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              {t('about.values.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-primary-700/95 dark:text-primary-200/85">
              {t('about.values.description', 'القيم التي نؤمن بها وتوجه عملنا اليومي')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.key}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group rounded-2xl border border-primary-200/80 bg-primary-50/50 p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-medium dark:border-primary-700/45 dark:bg-primary-900/50"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-primary-50 shadow-md ring-2 ring-primary-500/20 transition-transform duration-300 group-hover:scale-105 dark:ring-primary-400/25">
                  {value.icon}
                </div>
                <h3 className="mb-3 text-lg font-semibold text-primary-900 dark:text-primary-50">
                  {t(`about.values.${value.key}`)}
                </h3>
                <div className="mx-auto h-1 w-12 rounded-full bg-primary-gradient opacity-90" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section-padding bg-primary-50/90 dark:bg-primary-900/45">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-12 text-center md:mb-14"
          >
            <h2 className="gradient-text text-3xl font-bold tracking-tight md:text-4xl">
              {t('about.whyChooseUsTitle')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {[
              { icon: '🚀', titleKey: 'about.speed', descKey: 'about.speedDesc', delay: 0 },
              { icon: '💡', titleKey: 'about.innovationTitle', descKey: 'about.innovationDesc', delay: 0.1 },
              { icon: '🤝', titleKey: 'about.partnershipTitle', descKey: 'about.partnershipDesc', delay: 0.2 },
            ].map(({ icon, titleKey, descKey, delay }) => (
              <motion.div
                key={titleKey}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay }}
                className="card hover-lift rounded-2xl border border-primary-200/90 bg-white p-8 text-center dark:border-primary-700/50 dark:bg-primary-900/55"
              >
                <div className="mb-4 text-4xl" aria-hidden>
                  {icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-primary-900 dark:text-primary-50">
                  {t(titleKey)}
                </h3>
                <p className="text-primary-700/95 dark:text-primary-200/85">{t(descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
