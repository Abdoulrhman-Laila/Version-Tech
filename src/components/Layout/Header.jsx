import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../contexts/AppContext';
import logoImage from '../../assets/images/logo.jpeg';

/** Logo frame: `bg-primary-gradient` + ring (tailwind.config) */
const logoFrameClass =
  'flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-gradient p-0.5 shadow-md shadow-primary-900/25 ring-2 ring-primary-300/35 dark:ring-primary-500/30';

const iconBtnClass =
  'rounded-xl border border-primary-200/90 bg-primary-50/90 p-2 text-primary-700 transition-all duration-200 hover:border-primary-300 hover:bg-primary-100 dark:border-primary-600/50 dark:bg-primary-900/50 dark:text-primary-200 dark:hover:border-primary-500 dark:hover:bg-primary-800/70';

const Header = () => {
  const { t } = useTranslation();
  const { darkMode, setDarkMode, language, setLanguage, sidebarOpen, toggleSidebar } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', path: '/' },
    { key: 'about', path: '/about' },
    { key: 'services', path: '/services' },
    { key: 'team', path: '/team' },
    { key: 'projects', path: '/projects' },
    { key: 'contact', path: '/contact' },
  ];

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass shadow-soft border-b border-primary-200/70 dark:border-primary-700/50'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      {/* Accent line when scrolled — uses primary from tailwind.config */}
      {isScrolled && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"
          aria-hidden
        />
      )}

      <nav className="container-custom">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Brand: asset logo + Version-Tech */}
          <Link
            to="/"
            className="group flex items-center gap-3 rtl:space-x-reverse"
          >
            <div className={logoFrameClass}>
              <img
                src={logoImage}
                alt="Version-Tech"
                className="h-9 w-9 rounded-[10px] bg-primary-900/90 object-contain"
              />
            </div>
            <div className="hidden min-w-0 sm:block">
              <h1 className="gradient-text text-xl font-bold tracking-tight md:text-2xl">
                Version-Tech
              </h1>
              <p className="text-xs font-medium text-primary-600/90 dark:text-primary-300/90 md:text-sm">
                {language === 'ar' ? 'حلول تقنية' : 'Technology solutions'}
              </p>
            </div>
          </Link>

          {/* Desktop — .nav-link from index.css */}
          <div className="hidden items-center gap-1 lg:flex lg:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`nav-link rounded-lg px-3 py-2 text-sm font-medium md:text-base ${
                  location.pathname === item.path ? 'active text-primary-700 dark:text-primary-200' : ''
                }`}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 rtl:space-x-reverse sm:gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              className={iconBtnClass}
              aria-label={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
            >
              <span className="text-sm font-semibold text-primary-800 dark:text-primary-100">
                {language === 'ar' ? 'EN' : 'عر'}
              </span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className={iconBtnClass}
              aria-label={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? (
                <svg className="h-5 w-5 text-primary-600 dark:text-primary-300" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-primary-600 dark:text-primary-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={toggleSidebar}
              className={`${iconBtnClass} relative lg:hidden`}
              aria-label="Menu"
            >
              <span className="relative block h-5 w-5">
                <span
                  className={`absolute left-0 top-1 block h-0.5 w-5 rounded-full bg-primary-700 transition-all duration-300 dark:bg-primary-200 ${
                    sidebarOpen ? 'top-2.5 rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-2.5 block h-0.5 w-5 rounded-full bg-primary-700 transition-all duration-300 dark:bg-primary-200 ${
                    sidebarOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-4 block h-0.5 w-5 rounded-full bg-primary-700 transition-all duration-300 dark:bg-primary-200 ${
                    sidebarOpen ? 'top-2.5 -rotate-45' : ''
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out lg:hidden ${
            sidebarOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="space-y-1 border-t border-primary-200/80 py-4 dark:border-primary-700/50">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => toggleSidebar()}
                className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-gradient text-primary-50 shadow-md shadow-primary-900/20'
                    : 'text-primary-800 hover:bg-primary-100/80 dark:text-primary-100 dark:hover:bg-primary-800/50'
                }`}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
