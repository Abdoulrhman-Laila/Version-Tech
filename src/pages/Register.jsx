// src/pages/Register.js
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/UI/LoadingSpinner';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>{t('register.title')} - Shift Start</title>
      </Helmet>

      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <img src="/images/logo.png" alt="logo" className="mx-auto mb-4 w-20" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('register.title')}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('register.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('register.name')}
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder={t('register.name_placeholder')}
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('register.email')}
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('register.password')}
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gradient text-white py-2 px-4 rounded-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? t('register.creating') : t('register.create_account')}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/login')}
            className="text-brand-red hover:underline"
          >
            {t('register.already_have_account')} {t('register.sign_in')}
          </button>
        </div>

        {/* Language Switcher */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => i18n.changeLanguage('ar')}
            className="px-2 py-1 rounded bg-gray-200"
          >
            عربي
          </button>
          <button
            onClick={() => i18n.changeLanguage('en')}
            className="px-2 py-1 rounded bg-gray-200"
          >
            EN
          </button>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;