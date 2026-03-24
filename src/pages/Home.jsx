import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { projectsAPI } from '../services/api';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [featuredProjects, setFeaturedProjects] = useState([]);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await projectsAPI.getFeatured();
        setFeaturedProjects(response.data.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured projects:', error);
      }
    };

    fetchFeaturedProjects();
  }, []);

  const getLocalizedText = (item, field) => {
    if (!item?.[field]) return '';
    const v = item[field];
    if (typeof v === 'string') return v;
    const lang = i18n.language?.split('-')[0] || 'ar';
    return v[lang] || v.ar || v.en || '';
  };

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

  const services = [
    {
      key: 'webDevelopment',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      key: 'webDesign',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      ),
    },
    {
      key: 'mobileApps',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
        </svg>
      ),
    },
    {
      key: 'ecommerce',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
  ];

  const stats = [
    { number: '50+', key: 'projects' },
    { number: '30+', key: 'clients' },
    { number: '5+', key: 'years' },
    { number: '24/7', key: 'support' },
  ];

  const heroOrbs = [
    { className: 'left-[8%] top-[15%] h-24 w-24 bg-primary-500/25', delay: '0s' },
    { className: 'right-[12%] top-[28%] h-40 w-40 bg-primary-400/20', delay: '0.8s' },
    { className: 'bottom-[32%] left-[15%] h-32 w-32 bg-primary-600/15', delay: '1.6s' },
    { className: 'bottom-[12%] right-[8%] h-20 w-20 bg-primary-300/25', delay: '0.4s' },
  ];

  return (
    <>
      <Helmet>
        <title>{t('seo.home.title')}</title>
        <meta name="description" content={t('seo.home.description')} />
      </Helmet>

      {/* Hero — primary palette + index.css (gradient-text, hover-lift) */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100/95 to-primary-200/80 dark:from-primary-900 dark:via-primary-800 dark:to-primary-900">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(111,106,240,0.22),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(77,59,255,0.18),transparent)]" />
          {heroOrbs.map((orb, i) => (
            <div
              key={i}
              className={`absolute rounded-full blur-3xl animate-float ${orb.className}`}
              style={{ animationDelay: orb.delay }}
            />
          ))}
        </div>

        <div className="container-custom relative z-10 pt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="gradient-text mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
            >
              {t('hero.title')}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mx-auto mb-4 max-w-3xl text-xl font-medium text-primary-800/95 dark:text-primary-100/95 md:text-2xl"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-primary-700/90 dark:text-primary-200/85 md:text-lg"
            >
              {t('hero.description')}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                to="/contact"
                className="hover-lift inline-flex min-w-[200px] items-center justify-center rounded-xl bg-primary-gradient px-8 py-4 text-lg font-semibold text-primary-50 shadow-medium ring-2 ring-primary-500/25 transition-all duration-300 hover:shadow-lg dark:ring-primary-400/20"
              >
                {t('hero.cta')}
              </Link>
              <Link
                to="/about"
                className="inline-flex min-w-[200px] items-center justify-center rounded-xl border-2 border-primary-600/80 bg-primary-50/80 px-8 py-4 text-lg font-semibold text-primary-800 transition-all duration-300 hover:border-primary-600 hover:bg-primary-100 dark:border-primary-400/60 dark:bg-primary-900/40 dark:text-primary-100 dark:hover:bg-primary-800/60"
              >
                {t('hero.learnMore')}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 transform"
        >
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-primary-600/70 dark:border-primary-400/60">
            <div className="mt-2 h-2 w-1 animate-bounce rounded-full bg-primary-600 dark:bg-primary-400" />
          </div>
        </motion.div>
      </section>

      {/* Services */}
      <section ref={ref} className="section-padding bg-primary-50/90 dark:bg-primary-900/40">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="mb-16 text-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="gradient-text mb-4 text-3xl font-bold tracking-tight md:text-4xl"
            >
              {t('services.title')}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-lg text-primary-700/90 dark:text-primary-200/85"
            >
              {t('services.subtitle')}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          >
            {services.map((service) => (
              <motion.div
                key={service.key}
                variants={fadeInUp}
                className="group rounded-2xl border border-primary-200/80 bg-white/90 p-6 text-center shadow-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-medium dark:border-primary-700/45 dark:bg-primary-900/55"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-primary-50 shadow-md shadow-primary-900/20 ring-2 ring-primary-500/20 transition-transform duration-300 group-hover:scale-105 dark:ring-primary-400/25">
                  {service.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-primary-900 dark:text-primary-50">
                  {t(`services.${service.key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-primary-700/95 dark:text-primary-200/85">
                  {t(`services.${service.key}.description`)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured projects — uses API data; styled with primary + glass */}
      {featuredProjects.length > 0 && (
        <section className="section-padding border-y border-primary-200/60 bg-white/70 dark:border-primary-800/50 dark:bg-primary-900/30">
          <div className="container-custom">
            <div className="mb-12 text-center">
              <h2 className="gradient-text mb-3 text-3xl font-bold tracking-tight md:text-4xl">
                {t('projects.title')}
              </h2>
              <p className="mx-auto max-w-2xl text-primary-700/90 dark:text-primary-200/85">
                {t('projects.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project._id || project.id || index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  className="overflow-hidden rounded-2xl border border-primary-200/80 bg-white shadow-soft transition-shadow hover:shadow-medium dark:border-primary-700/50 dark:bg-primary-900/60"
                >
                  <Link to="/projects" className="block">
                    <div className="relative aspect-[16/10] overflow-hidden bg-primary-100 dark:bg-primary-800/50">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-primary-400">
                          <svg className="h-14 w-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {project.featured && (
                        <span className="absolute right-3 top-3 rounded-full bg-primary-gradient px-3 py-1 text-xs font-semibold text-primary-50 shadow-md">
                          {t('projects.featured')}
                        </span>
                      )}
                    </div>
                    <div className="p-5 text-start">
                      <h3 className="mb-2 line-clamp-2 text-lg font-bold text-primary-900 dark:text-primary-50">
                        {getLocalizedText(project, 'title')}
                      </h3>
                      <p className="line-clamp-2 text-sm text-primary-700/90 dark:text-primary-200/80">
                        {getLocalizedText(project, 'description')}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                to="/projects"
                className="hover-lift inline-flex items-center justify-center rounded-xl border-2 border-primary-600/50 bg-primary-50 px-6 py-3 font-semibold text-primary-800 transition-colors hover:border-primary-600 hover:bg-primary-100 dark:border-primary-500/40 dark:bg-primary-900/50 dark:text-primary-100 dark:hover:bg-primary-800/70"
              >
                {t('nav.projects')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="section-padding bg-primary-gradient text-primary-50 shadow-inner">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="text-center"
              >
                <div className="mb-2 text-4xl font-bold drop-shadow-sm md:text-5xl">{stat.number}</div>
                <div className="text-base font-medium text-primary-100/95">{t(`stat.${stat.key}`)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-50/90 dark:bg-primary-900/40">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="glass rounded-3xl border border-primary-200/70 p-10 text-center shadow-medium dark:border-primary-600/40 md:p-14"
          >
            <h2 className="gradient-text mb-6 text-3xl font-bold tracking-tight md:text-4xl">
              {t('callToAction.title')}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-800/90 dark:text-primary-100/85">
              {t('callToAction.description')}
            </p>
            <Link
              to="/contact"
              className="hover-lift inline-flex items-center justify-center rounded-xl bg-primary-gradient px-8 py-4 text-lg font-semibold text-primary-50 shadow-medium ring-2 ring-primary-500/30 transition-all duration-300 hover:shadow-lg dark:ring-primary-300/25"
            >
              {t('callToAction.button')}
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
