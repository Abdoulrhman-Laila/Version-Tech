// src/pages/Register.js
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import logoImage from '../assets/images/logo.jpeg';

const Register = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      if (response.data.success) {
        alert(t('register.success'));
        navigate('/login'); // الانتقال إلى صفحة تسجيل الدخول
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || t('register.failed');
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100/95 to-primary-200/80 dark:from-primary-900 dark:via-primary-800 dark:to-primary-900">
      <Helmet>
        <title>{t('register.title')} - Shift Start</title>
      </Helmet>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(111,106,240,0.22),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(77,59,255,0.18),transparent)]" />
        <div className="absolute -left-16 top-24 h-56 w-56 rounded-full bg-primary-500/15 blur-3xl dark:bg-primary-600/10" />
        <div className="absolute -right-16 bottom-20 h-48 w-48 rounded-full bg-primary-400/20 blur-3xl dark:bg-primary-500/10" />
      </div>

      <div className="glass relative z-10 mx-4 w-full max-w-md space-y-7 rounded-2xl p-8 shadow-medium ring-1 ring-primary-500/10 dark:ring-primary-400/15">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-primary-gradient p-1 shadow-soft ring-2 ring-primary-300/35 dark:ring-primary-500/30">
            <img
              src={logoImage}
              alt="Version-Tech"
              className="h-full w-full rounded-[14px] bg-primary-900/90 object-contain"
              loading="eager"
              decoding="async"
            />
          </div>
          <h2 className="gradient-text text-3xl font-bold tracking-tight">
            {t('register.title')}
          </h2>
          <p className="mt-2 text-primary-700/90 dark:text-primary-200/85">
            {t('register.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="mb-2 block text-sm font-medium text-primary-900 dark:text-primary-100">
              {t('register.name')}
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder={t('register.name_placeholder')}
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="mb-2 block text-sm font-medium text-primary-900 dark:text-primary-100">
              {t('register.email')}
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="mb-2 block text-sm font-medium text-primary-900 dark:text-primary-100">
              {t('register.password')}
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="••••••••"
            />
            <p className="mt-2 text-xs font-medium text-primary-600/90 dark:text-primary-300/90">
              {i18n.language?.startsWith('ar') ? 'استخدم كلمة مرور قوية.' : 'Use a strong password.'}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gradient hover-lift w-full py-3 disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? t('register.creating') : t('register.create_account')}
          </button>
        </form>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary-300/50 to-transparent dark:via-primary-600/35" />

        {/* Login Link */}
        <div className="text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-primary-700 underline decoration-primary-300/60 underline-offset-4 transition hover:text-primary-800 dark:text-primary-200 dark:hover:text-primary-100"
          >
            {t('register.already_have_account')} {t('register.sign_in')}
          </button>
        </div>

        {/* Language Switcher */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => i18n.changeLanguage('ar')}
            className="btn-outline btn-sm"
          >
            عربي
          </button>
          <button
            onClick={() => i18n.changeLanguage('en')}
            className="btn-outline btn-sm"
          >
            EN
          </button>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/45 backdrop-blur-sm dark:bg-primary-900/70">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;