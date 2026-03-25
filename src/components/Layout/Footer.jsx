import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../contexts/AppContext';
import logoImage from '../../assets/images/logo.jpeg';

/** `primary` + `bg-primary-gradient` (tailwind.config); `.gradient-text` (index.css) */
const logoFrameClass =
  'flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-gradient p-0.5 shadow-lg shadow-primary-900/40 ring-2 ring-primary-300/40 dark:ring-primary-500/35';

const logoTitleClass = 'gradient-text text-xl font-bold tracking-tight';

const taglineClass = 'text-xs font-medium text-primary-200/90 sm:text-sm';

const bodyOnDark = 'text-sm leading-relaxed text-primary-100/95';

const sectionHeadingClass =
  'mb-5 inline-flex items-center gap-2 border-b border-primary-500/35 pb-2 text-sm font-semibold uppercase tracking-wider text-primary-50';

const linkClass =
  'text-sm text-primary-100/95 underline-offset-4 decoration-primary-300/40 transition-colors duration-200 hover:text-primary-50 hover:decoration-primary-200/80';

const socialChipClass =
  'flex h-11 w-11 items-center justify-center rounded-full bg-primary-gradient text-primary-50 shadow-lg shadow-primary-900/45 ring-2 ring-primary-500/25 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary-900/60 hover:ring-primary-300/40';

const contactIconWrap =
  'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-800/70 text-primary-200 ring-1 ring-primary-500/25';

const Footer = () => {
  const { t } = useTranslation();
  const { language } = useApp();

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { key: 'home', path: '/' },
    { key: 'about', path: '/about' },
    { key: 'team', path: '/team' },
    { key: 'projects', path: '/projects' },
    { key: 'contact', path: '/contact' },
  ];

  const services = [
    'webDevelopment',
    'webDesign',
    'mobileApps',
    'ecommerce',
    'seo',
    'maintenance',
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
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
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
    <footer className="relative overflow-hidden bg-gradient-to-b from-primary-900 via-primary-800 to-primary-900 text-primary-50">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/55 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-64 w-64 rounded-full bg-primary-600/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-primary-500/10 blur-3xl"
        aria-hidden
      />

      <div className="container-custom relative">
        <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="mb-5 flex items-center space-x-3 rtl:space-x-reverse">
              <div className={logoFrameClass}>
                <img
                  src={logoImage}
                  alt="Version-Tech"
                  className="h-9 w-9 rounded-[10px] bg-primary-900/90 object-contain"
                />
              </div>
              <div>
                <h3 className={logoTitleClass}>Version-Tech</h3>
                <p className={taglineClass}>
                  {language === 'ar' ? 'حلول تقنية' : 'Technology solutions'}
                </p>
              </div>
            </div>
            <p className={`mb-6 max-w-sm ${bodyOnDark}`}>{t('footer.description')}</p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={socialChipClass}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className={sectionHeadingClass}>
              <span
                className="h-1.5 w-1.5 rounded-full bg-primary-gradient shadow-sm shadow-primary-500/50"
                aria-hidden
              />
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link to={link.path} className={`${linkClass} underline`}>
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={sectionHeadingClass}>
              <span
                className="h-1.5 w-1.5 rounded-full bg-primary-gradient shadow-sm shadow-primary-500/50"
                aria-hidden
              />
              {t('footer.services')}
            </h4>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service}>
                  <span className="flex items-start gap-2 text-sm font-medium text-primary-100/95">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500/80"
                      aria-hidden
                    />
                    {t(`services.${service}.title`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={sectionHeadingClass}>
              <span
                className="h-1.5 w-1.5 rounded-full bg-primary-gradient shadow-sm shadow-primary-500/50"
                aria-hidden
              />
              {t('footer.contact')}
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className={contactIconWrap}>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm text-primary-100/95">سوريا، دمشق</span>
              </div>
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className={contactIconWrap}>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <a
                  href="tel:+963982187269"
                  className={`${linkClass} text-sm font-medium`}
                >
                  +963982187269
                </a>
              </div>
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className={contactIconWrap}>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <span className="text-sm text-primary-100/95">info@versiontech.sy</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-700/50 bg-primary-900/40 py-7 backdrop-blur-[2px]">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-primary-200/95 md:text-start">
              © {currentYear} Version-Tech. {t('footer.rights')}.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 rtl:space-x-reverse">
              <Link to="/privacy" className={`${linkClass} underline`}>
                سياسة الخصوصية
              </Link>
              <Link to="/terms" className={`${linkClass} underline`}>
                شروط الاستخدام
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
