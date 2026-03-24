import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectsAPI, handleApiError } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';

/** Tech chips — all from `primary` scale (tailwind.config) */
const TECH_CHIP_ROTATE = [
  'border-primary-200/90 bg-primary-100/95 text-primary-900 dark:border-primary-600/50 dark:bg-primary-800/55 dark:text-primary-100',
  'border-primary-300/80 bg-primary-50/95 text-primary-900 dark:border-primary-500/40 dark:bg-primary-900/50 dark:text-primary-100',
  'border-primary-200/90 bg-primary-200/40 text-primary-900 dark:border-primary-600/45 dark:bg-primary-700/45 dark:text-primary-50',
];

const techChipClass = (idx) =>
  `${TECH_CHIP_ROTATE[idx % TECH_CHIP_ROTATE.length]} border px-3 py-1 text-xs font-medium rounded-full`;

const Projects = () => {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lang = useMemo(() => i18n.language?.split('-')[0] || 'ar', [i18n.language]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectsAPI.getAll();
        setProjects(response.data.data || []);
        setError(null);
      } catch (err) {
        handleApiError(err);
        setError('حدث خطأ أثناء جلب البيانات');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const categories = [
    { key: 'all', icon: '🌐', labelKey: 'projects.categories.all' },
    { key: 'website', icon: '💻', labelKey: 'projects.categories.website' },
    { key: 'mobile', icon: '📱', labelKey: 'projects.categories.mobile' },
    { key: 'ecommerce', icon: '🛒', labelKey: 'projects.categories.ecommerce' },
    { key: 'corporate', icon: '🏢', labelKey: 'projects.categories.corporate' },
  ];

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  const getLocalizedText = (item, field) => {
    if (!item[field]) return '';
    const v = item[field];
    if (typeof v === 'string') return v;
    return v[lang] || v.en || v.ar || '';
  };

  const filterBtnActive =
    'bg-primary-gradient text-primary-50 shadow-md shadow-primary-900/25 ring-2 ring-primary-500/30 dark:ring-primary-300/25';
  const filterBtnIdle =
    'border border-primary-300/90 bg-white text-primary-800 hover:border-primary-500 hover:bg-primary-50 dark:border-primary-600/60 dark:bg-primary-900/40 dark:text-primary-100 dark:hover:border-primary-500 dark:hover:bg-primary-800/50';

  return (
    <>
      <Helmet>
        <title>{t('seo.projects.title')}</title>
        <meta name="description" content={t('seo.projects.description')} />
      </Helmet>

      {loading && (
        <div className="flex min-h-[50vh] items-center justify-center bg-primary-50/50 dark:bg-primary-900/40">
          <LoadingSpinner />
        </div>
      )}

      {!loading && error && (
        <div className="container-custom py-16">
          <div
            role="alert"
            className="glass rounded-2xl border border-primary-300/60 bg-primary-50/90 px-6 py-10 text-center dark:border-primary-600/50 dark:bg-primary-900/60"
          >
            <p className="text-lg font-semibold text-primary-800 dark:text-primary-100">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Hero */}
          <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100/95 to-primary-200/70 pt-24 pb-12 dark:from-primary-900 dark:via-primary-800 dark:to-primary-900 md:pt-28 md:pb-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(111,106,240,0.18),transparent)] dark:bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(77,59,255,0.14),transparent)]" />
            <div className="pointer-events-none absolute -right-24 top-16 h-64 w-64 rounded-full bg-primary-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-primary-600/12 blur-3xl" />

            <div className="container-custom relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="text-center"
              >
                <h1 className="gradient-text mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                  {t('projects.title')}
                </h1>
                <p className="mx-auto max-w-3xl text-lg font-medium text-primary-800/95 dark:text-primary-100/90 md:text-xl">
                  {t('projects.subtitle')}
                </p>
              </motion.div>
            </div>
          </section>

          {/* Filters + grid */}
          <section className="section-padding bg-primary-50/90 dark:bg-primary-900/40">
            <div className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12 flex flex-wrap justify-center gap-3"
              >
                {categories.map((category) => (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => setActiveFilter(category.key)}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 md:text-base ${
                      activeFilter === category.key ? filterBtnActive : filterBtnIdle
                    }`}
                  >
                    <span aria-hidden>{category.icon}</span>
                    <span>{t(category.labelKey)}</span>
                  </button>
                ))}
              </motion.div>

              <motion.div layout className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project._id || project.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="card hover-lift flex h-full flex-col overflow-hidden rounded-2xl border border-primary-200/90 dark:border-primary-700/50">
                      <div className="relative overflow-hidden">
                        <img
                          src={project.image}
                          alt={getLocalizedText(project, 'title')}
                          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-primary-900/90 via-primary-700/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="flex space-x-4 rtl:space-x-reverse">
                            {project.url && (
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-700 shadow-lg ring-2 ring-primary-500/25 transition hover:scale-105 dark:bg-primary-100 dark:text-primary-900"
                                aria-label="Live"
                              >
                                <svg
                                  className="h-6 w-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>
                            )}
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-700 shadow-lg ring-2 ring-primary-500/25 transition hover:scale-105 dark:bg-primary-100 dark:text-primary-900"
                                aria-label="GitHub"
                              >
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>

                        {project.featured && (
                          <div className="absolute right-3 top-3 rounded-full bg-primary-gradient px-3 py-1 text-xs font-semibold text-primary-50 shadow-md">
                            {t('projects.featured')}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="mb-2 text-xl font-bold text-primary-900 dark:text-primary-50">
                          {getLocalizedText(project, 'title')}
                        </h3>
                        <p className="mb-4 flex-1 text-sm leading-relaxed text-primary-700/95 dark:text-primary-200/85">
                          {getLocalizedText(project, 'description')}
                        </p>

                        {project.technologies?.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            {project.technologies.map((tech, idx) => (
                              <span key={idx} className={techChipClass(idx)}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-auto flex flex-wrap gap-3">
                          {(project.links?.live || project.url) && (
                            <a
                              href={project.links?.live || project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover-lift flex-1 rounded-xl bg-primary-gradient py-2.5 text-center text-sm font-semibold text-primary-50 shadow-md ring-2 ring-primary-500/25 transition dark:ring-primary-300/20"
                            >
                              {t('projects.visitSite')}
                            </a>
                          )}
                          <button
                            type="button"
                            className="rounded-xl border-2 border-primary-500/35 bg-primary-50/80 px-4 py-2.5 text-sm font-semibold text-primary-800 transition hover:border-primary-600 hover:bg-primary-100 dark:border-primary-500/45 dark:bg-primary-900/50 dark:text-primary-100 dark:hover:bg-primary-800/70"
                            onClick={() => alert(t('projects.viewProject'))}
                          >
                            {t('projects.viewProject')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {filteredProjects.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-2xl border border-primary-200/80 py-14 text-center dark:border-primary-700/50"
                >
                  <div className="mb-4 text-5xl" aria-hidden>
                    🔍
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-primary-900 dark:text-primary-50">
                    {t('projects.noProjectsTitle')}
                  </h3>
                  <p className="text-primary-700/90 dark:text-primary-200/90">
                    {t('projects.noProjectsDesc')}
                  </p>
                </motion.div>
              )}
            </div>
          </section>

          {/* CTA */}
          <section className="section-padding bg-primary-gradient text-primary-50 shadow-inner">
            <div className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                  {t('projects.ctaTitle')}
                </h2>
                <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-100/95">
                  {t('projects.ctaDesc')}
                </p>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/contact"
                    className="hover-lift inline-flex items-center justify-center rounded-xl bg-primary-50 px-8 py-4 text-lg font-semibold text-primary-700 shadow-md transition hover:bg-white"
                  >
                    {t('projects.ctaButton')}
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Projects;
