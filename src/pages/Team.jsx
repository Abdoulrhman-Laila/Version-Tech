import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';

const viewportReveal = { once: true, amount: 0.15, margin: '0px 0px -48px 0px' };
const easeOut = [0.22, 1, 0.36, 1];
import { teamAPI, handleApiError } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { FaGithub, FaLinkedin, FaTwitter, FaDribbble, FaBehance } from 'react-icons/fa';

/** Per-role accent for hover wash — all `primary-*` from tailwind.config */
const ROLE_COLORS = {
  fullstack: 'from-primary-600 to-primary-800',
  frontend: 'from-primary-500 to-primary-700',
  backend: 'from-primary-500 to-primary-800',
  ui: 'from-primary-400 to-primary-600',
  ux: 'from-primary-400 to-primary-700',
  manager: 'from-primary-600 to-primary-900',
  designer: 'from-primary-300 to-primary-500',
};

const SOCIAL_ICONS = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  dribbble: FaDribbble,
  behance: FaBehance,
};

const FALLBACK_TEAM = [
  {
    id: 1,
    name: { ar: 'أحمد', en: 'Ahmed' },
    role: 'fullstack',
    bio: { ar: 'مطور شامل', en: 'Fullstack Developer' },
    image: '/api/placeholder/300/300',
    skills: [{ ar: 'React', en: 'React' }],
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    },
    joinedAt: '2023-01-15',
  },
  {
    id: 2,
    name: { ar: 'فاطمة', en: 'Fatima' },
    role: 'ui',
    bio: { ar: 'مصممة واجهات', en: 'UI Designer' },
    image: '/api/placeholder/300/300',
    skills: [{ ar: 'فيجما', en: 'Figma' }],
    social: {
      dribbble: 'https://dribbble.com',
      behance: 'https://behance.com',
      linkedin: 'https://linkedin.com',
    },
    joinedAt: '2022-10-20',
  },
];

function getSocialEntries(member) {
  if (member.socialLinks?.length) {
    return member.socialLinks.map((item) => ({
      platform: item.platform,
      url: item.url,
    }));
  }
  if (member.social && typeof member.social === 'object') {
    return Object.entries(member.social).map(([platform, url]) => ({ platform, url }));
  }
  return [];
}

const Team = () => {
  const { t, i18n } = useTranslation();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reduceMotion = useReducedMotion();

  const lang = useMemo(() => i18n.language?.split('-')[0] || 'ar', [i18n.language]);

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
          staggerChildren: reduceMotion ? 0 : 0.08,
          delayChildren: reduceMotion ? 0 : 0.06,
        },
      },
    }),
    [reduceMotion]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await teamAPI.getAll();

        if (isMounted) {
          setTeamMembers(response.data?.data || FALLBACK_TEAM);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          const errorInfo = handleApiError(err);
          setError(errorInfo.message);
          setTeamMembers(FALLBACK_TEAM);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTeamMembers();

    return () => {
      isMounted = false;
    };
  }, []);

  const getRoleGradient = (role) =>
    ROLE_COLORS[role] || 'from-primary-500 to-primary-700';

  const pickLocalized = (field) => {
    if (field == null) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field.ar || field.en || '';
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-primary-50/50 dark:bg-primary-900/40">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-16">
        <div
          role="alert"
          className="glass rounded-2xl border border-primary-300/60 bg-primary-50/90 px-6 py-10 text-center dark:border-primary-600/50 dark:bg-primary-900/60"
        >
          <p className="text-lg font-semibold text-primary-800 dark:text-primary-100">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('seo.team.title')}</title>
        <meta name="description" content={t('seo.team.description')} />
      </Helmet>

      {/* Hero — index.css `.gradient-text` + primary mesh */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100/95 to-primary-200/70 pt-24 pb-14 dark:from-primary-900 dark:via-primary-800 dark:to-primary-900 md:pt-28 md:pb-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(111,106,240,0.18),transparent)] dark:bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(77,59,255,0.14),transparent)]" />
        {!reduceMotion && (
          <>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -right-20 top-20 h-56 w-56 rounded-full bg-primary-500/15 blur-3xl"
              animate={{ scale: [1, 1.07, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -left-16 bottom-10 h-40 w-40 rounded-full bg-primary-600/12 blur-3xl"
              animate={{ scale: [1, 1.06, 1], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            />
          </>
        )}
        {reduceMotion && (
          <>
            <div
              className="pointer-events-none absolute -right-20 top-20 h-56 w-56 rounded-full bg-primary-500/15 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -left-16 bottom-10 h-40 w-40 rounded-full bg-primary-600/12 blur-3xl"
              aria-hidden
            />
          </>
        )}

        <div className="container-custom relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.h1
              variants={fadeInUp}
              className="gradient-text mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            >
              {t('team.title')}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-3xl text-lg font-medium text-primary-800/95 dark:text-primary-100/90 md:text-xl"
            >
              {t('team.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Team grid */}
      <section className="section-padding bg-white/80 dark:bg-primary-900/35">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportReveal}
          variants={gridStagger}
          className="container-custom grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3"
        >
          {teamMembers.map((member) => {
            const socialEntries = getSocialEntries(member);
            const name = pickLocalized(member.name);
            const bio = pickLocalized(member.bio);
            const roleKey = member.role ? `team.roles.${member.role}` : '';
            const roleLabel = member.role
              ? t(roleKey, { defaultValue: member.role })
              : '—';

            return (
              <motion.div
                key={member._id || member.id}
                variants={cardReveal}
                whileHover={
                  reduceMotion ? undefined : { y: -5, transition: { duration: 0.22, ease: easeOut } }
                }
                className="group"
              >
                <div className="card hover-lift relative overflow-hidden rounded-2xl border border-primary-200/90 p-6 text-center shadow-sm transition-shadow duration-300 group-hover:shadow-lg dark:border-primary-700/50">
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${getRoleGradient(member.role)} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.12] dark:group-hover:opacity-[0.15]`}
                    aria-hidden
                  />

                  <div className="relative z-10">
                    <motion.div
                      className="mx-auto mb-5 flex h-36 w-36 items-center justify-center"
                      whileHover={
                        reduceMotion
                          ? undefined
                          : { scale: 1.02, transition: { type: 'spring', stiffness: 380, damping: 22 } }
                      }
                    >
                      <div className="rounded-full bg-primary-gradient p-0.5 shadow-lg shadow-primary-900/20 ring-2 ring-primary-300/40 dark:ring-primary-500/30">
                        <div className="h-[8.75rem] w-[8.75rem] overflow-hidden rounded-full border-2 border-white/90 dark:border-primary-900/80">
                          <img
                            src={member.image || '/api/placeholder/300/300'}
                            alt={name || 'member'}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      </div>
                    </motion.div>

                    <h3 className="mb-1 text-xl font-bold text-primary-900 dark:text-primary-50">
                      {name || '—'}
                    </h3>

                    <p className="mb-1 text-sm font-semibold text-primary-600 dark:text-primary-300">
                      {roleLabel}
                    </p>

                    <p className="mb-4 text-xs text-primary-500 dark:text-primary-400">
                      {member.joinedAt
                        ? new Date(member.joinedAt).toLocaleDateString(
                            i18n.language === 'ar' ? 'ar-EG' : 'en-US'
                          )
                        : '—'}
                    </p>

                    <p className="mb-5 min-h-[4.5rem] line-clamp-3 text-sm leading-relaxed text-primary-700/95 dark:text-primary-200/85">
                      {bio || t('team.noBio', { defaultValue: '—' })}
                    </p>

                    <div className="mb-5 flex min-h-[2rem] flex-wrap justify-center gap-2">
                      {member.skills?.length > 0 ? (
                        member.skills.map((skill, idx) => {
                          const skillText =
                            typeof skill === 'string' ? skill : pickLocalized(skill);
                          return (
                            <span
                              key={idx}
                              className="rounded-full border border-primary-200/80 bg-primary-100/90 px-3 py-1 text-xs font-medium text-primary-800 dark:border-primary-600/50 dark:bg-primary-800/60 dark:text-primary-100"
                            >
                              {skillText || '—'}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-sm text-primary-500/80 dark:text-primary-400/80">
                          {t('team.noSkills', { defaultValue: 'لا توجد مهارات' })}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                      {socialEntries.length > 0 ? (
                        socialEntries.map(({ platform, url }) => {
                          const Icon = SOCIAL_ICONS[platform];
                          if (!Icon || !url) return null;
                          return (
                            <motion.a
                              key={`${platform}-${url}`}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-gradient text-primary-50 shadow-md shadow-primary-900/25 ring-2 ring-primary-500/20 transition-shadow duration-300 hover:shadow-lg dark:ring-primary-400/25"
                              aria-label={platform}
                              whileHover={reduceMotion ? undefined : { scale: 1.1, y: -2 }}
                              whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                            >
                              <Icon className="h-4 w-4" />
                            </motion.a>
                          );
                        })
                      ) : (
                        <span className="text-sm text-primary-500/80 dark:text-primary-400/80">
                          {t('team.noSocial', { defaultValue: 'لا توجد روابط' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </>
  );
};

export default Team;
