import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

const viewportReveal = { once: true, amount: 0.15, margin: '0px 0px -48px 0px' };

const easeOut = [0.22, 1, 0.36, 1];

const Services = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const fadeInUp = useMemo(
    () => ({
      hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 28 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0 : 0.52, ease: easeOut },
      },
    }),
    [reduceMotion]
  );

  const staggerContainer = useMemo(
    () => ({
      hidden: { opacity: reduceMotion ? 1 : 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: reduceMotion ? 0 : 0.1,
          delayChildren: reduceMotion ? 0 : 0.06,
        },
      },
    }),
    [reduceMotion]
  );

  const cardReveal = useMemo(
    () => ({
      hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 32 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0 : 0.44, ease: easeOut },
      },
    }),
    [reduceMotion]
  );

  const gridStagger = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduceMotion ? 0 : 0.07,
          delayChildren: reduceMotion ? 0 : 0.08,
        },
      },
    }),
    [reduceMotion]
  );

  const chipReveal = useMemo(
    () => ({
      hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 14 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0 : 0.3, ease: easeOut },
      },
    }),
    [reduceMotion]
  );

  const services = [
    {
      key: 'webDevelopment',
      icon: (
        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      featuresKeys: [
        'services.webDevelopment.features.0',
        'services.webDevelopment.features.1',
        'services.webDevelopment.features.2',
        'services.webDevelopment.features.3',
      ],
    },
    {
      key: 'webDesign',
      icon: (
        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      ),
      featuresKeys: [
        'services.webDesign.features.0',
        'services.webDesign.features.1',
        'services.webDesign.features.2',
        'services.webDesign.features.3',
      ],
    },
    {
      key: 'mobileApps',
      icon: (
        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
        </svg>
      ),
      featuresKeys: [
        'services.mobileApps.features.0',
        'services.mobileApps.features.1',
        'services.mobileApps.features.2',
        'services.mobileApps.features.3',
      ],
    },
    {
      key: 'ecommerce',
      icon: (
        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      featuresKeys: [
        'services.ecommerce.features.0',
        'services.ecommerce.features.1',
        'services.ecommerce.features.2',
        'services.ecommerce.features.3',
      ],
    },
    {
      key: 'seo',
      icon: (
        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      featuresKeys: [
        'services.seo.features.0',
        'services.seo.features.1',
        'services.seo.features.2',
        'services.seo.features.3',
      ],
    },
    {
      key: 'maintenance',
      icon: (
        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      featuresKeys: [
        'services.maintenance.features.0',
        'services.maintenance.features.1',
        'services.maintenance.features.2',
        'services.maintenance.features.3',
      ],
    },
  ];

  const process = [
    {
      step: '01',
      titleKey: 'services.process.steps.0.title',
      descriptionKey: 'services.process.steps.0.description',
      icon: '🔍',
    },
    {
      step: '02',
      titleKey: 'services.process.steps.1.title',
      descriptionKey: 'services.process.steps.1.description',
      icon: '📋',
    },
    {
      step: '03',
      titleKey: 'services.process.steps.2.title',
      descriptionKey: 'services.process.steps.2.description',
      icon: '🎨',
    },
    {
      step: '04',
      titleKey: 'services.process.steps.3.title',
      descriptionKey: 'services.process.steps.3.description',
      icon: '⚡',
    },
    {
      step: '05',
      titleKey: 'services.process.steps.4.title',
      descriptionKey: 'services.process.steps.4.description',
      icon: '🧪',
    },
    {
      step: '06',
      titleKey: 'services.process.steps.5.title',
      descriptionKey: 'services.process.steps.5.description',
      icon: '🚀',
    },
  ];

  const technologies = [
    'services.technologies.react',
    'services.technologies.vue',
    'services.technologies.node',
    'services.technologies.python',
    'services.technologies.mongodb',
    'services.technologies.postgresql',
    'services.technologies.docker',
    'services.technologies.aws',
    'services.technologies.figma',
    'services.technologies.tailwind',
    'services.technologies.typescript',
    'services.technologies.nextjs',
  ];

  return (
    <>
      <Helmet>
        <title>{t('services.title')}</title>
        <meta name="description" content={t('services.subtitle')} />
      </Helmet>

      {/* Hero — `.gradient-text` + primary mesh (tailwind + index.css) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100/95 to-primary-200/70 pt-24 pb-16 dark:from-primary-900 dark:via-primary-800 dark:to-primary-900 md:pt-28 md:pb-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(111,106,240,0.18),transparent)] dark:bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(77,59,255,0.14),transparent)]" />
        {!reduceMotion && (
          <>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -right-24 top-16 h-64 w-64 rounded-full bg-primary-500/15 blur-3xl"
              animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -left-20 bottom-8 h-48 w-48 rounded-full bg-primary-600/12 blur-3xl"
              animate={{ scale: [1, 1.06, 1], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            />
          </>
        )}
        {reduceMotion && (
          <>
            <div className="pointer-events-none absolute -right-24 top-16 h-64 w-64 rounded-full bg-primary-500/15 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -left-20 bottom-8 h-48 w-48 rounded-full bg-primary-600/12 blur-3xl" aria-hidden />
          </>
        )}

        <div className="container-custom relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="gradient-text mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            >
              {t('services.title')}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-3xl text-lg font-medium text-primary-800/95 dark:text-primary-100/90 md:text-xl"
            >
              {t('services.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services grid */}
      <section className="section-padding bg-white/80 dark:bg-primary-900/35">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportReveal}
            variants={gridStagger}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service) => (
              <motion.div
                key={service.key}
                variants={cardReveal}
                whileHover={reduceMotion ? undefined : { y: -5, transition: { duration: 0.22, ease: easeOut } }}
                className="group"
              >
                <div className="card hover-lift relative h-full overflow-hidden rounded-2xl border border-primary-200/90 p-8 transition-shadow duration-300 group-hover:shadow-lg dark:border-primary-700/50">
                  <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative z-10">
                    <motion.div
                      className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-primary-50 shadow-md ring-2 ring-primary-500/25 dark:ring-primary-400/25"
                      whileHover={
                        reduceMotion
                          ? undefined
                          : { scale: 1.06, rotate: -2, transition: { type: 'spring', stiffness: 400, damping: 18 } }
                      }
                    >
                      {service.icon}
                    </motion.div>

                    <h3 className="mb-3 text-xl font-bold text-primary-900 dark:text-primary-50 md:text-2xl">
                      {t(`services.${service.key}.title`)}
                    </h3>

                    <p className="mb-6 leading-relaxed text-primary-700/95 dark:text-primary-200/85">
                      {t(`services.${service.key}.description`)}
                    </p>

                    <ul className="space-y-2.5">
                      {service.featuresKeys.map((featureKey, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-sm text-primary-800/95 dark:text-primary-100/90"
                        >
                          <span
                            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-500 shadow-sm shadow-primary-500/40"
                            aria-hidden
                          />
                          <span>{t(featureKey)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-primary-50/90 dark:bg-primary-900/45">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportReveal}
            variants={staggerContainer}
            className="mb-14 text-center md:mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="gradient-text mb-4 text-3xl font-bold tracking-tight md:text-4xl"
            >
              {t('services.process.title')}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-lg text-primary-700/95 dark:text-primary-200/85"
            >
              {t('services.process.subtitle')}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportReveal}
            variants={gridStagger}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          >
            {process.map((step) => (
              <motion.div
                key={step.step}
                variants={cardReveal}
                whileHover={reduceMotion ? undefined : { y: -4, transition: { duration: 0.22, ease: easeOut } }}
                className="relative"
              >
                <div className="glass card hover-lift h-full rounded-2xl border border-primary-200/80 p-6 text-center dark:border-primary-600/40 md:p-8">
                  <div className="mb-3 text-3xl" aria-hidden>
                    {step.icon}
                  </div>
                  <div className="mb-2 inline-flex rounded-full bg-primary-gradient px-3 py-1 text-xs font-bold text-primary-50 shadow-sm">
                    {step.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-primary-900 dark:text-primary-50">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-sm leading-relaxed text-primary-700/95 dark:text-primary-200/85">
                    {t(step.descriptionKey)}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technologies */}
      <section className="section-padding bg-white/80 dark:bg-primary-900/35">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportReveal}
            variants={staggerContainer}
            className="mb-14 text-center md:mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="gradient-text mb-4 text-3xl font-bold tracking-tight md:text-4xl"
            >
              {t('services.technologies.title')}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-lg text-primary-700/95 dark:text-primary-200/85"
            >
              {t('services.technologies.subtitle')}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportReveal}
            variants={gridStagger}
            className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-5"
          >
            {technologies.map((techKey) => (
              <motion.div
                key={techKey}
                variants={chipReveal}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -3, scale: 1.03, transition: { duration: 0.2, ease: easeOut } }
                }
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="rounded-xl border border-primary-200/90 bg-primary-50/80 px-3 py-4 text-center shadow-sm transition-colors duration-200 hover:border-primary-400/60 hover:bg-primary-100/80 dark:border-primary-600/45 dark:bg-primary-900/55 dark:hover:border-primary-500/50 dark:hover:bg-primary-800/50"
              >
                <span className="text-sm font-semibold text-primary-800 dark:text-primary-100">
                  {t(techKey)}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA — `bg-primary-gradient` from tailwind.config */}
      <section className="section-padding bg-primary-gradient text-primary-50 shadow-inner">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportReveal}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="mb-4 text-3xl font-bold tracking-tight md:text-4xl"
            >
              {t('services.cta.title')}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mx-auto mb-10 max-w-2xl text-lg text-primary-100/95"
            >
              {t('services.cta.subtitle')}
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
            >
              <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/contact"
                  className="hover-lift inline-flex min-w-[200px] items-center justify-center rounded-xl bg-primary-50 px-8 py-4 text-lg font-semibold text-primary-700 shadow-md transition-all duration-300 hover:bg-white"
                >
                  {t('services.cta.startProject')}
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/projects"
                  className="inline-flex min-w-[200px] items-center justify-center rounded-xl border-2 border-primary-100/90 bg-transparent px-8 py-4 text-lg font-semibold text-primary-50 transition-all duration-300 hover:bg-primary-50/15 hover:ring-2 hover:ring-primary-100/40"
                >
                  {t('services.cta.viewProjects')}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Services;
