import React from 'react';
import { useTranslation } from 'react-i18next';

const LoadingSpinner = ({ size = 'default', text = true }) => {
  const { t } = useTranslation();

  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-gray-700 rounded-full`}></div>
        
        {/* Inner spinning ring */}
        <div className={`${sizeClasses[size]} border-4 border-transparent border-t-brand-red border-r-brand-pink rounded-full animate-spin absolute top-0 left-0`}></div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-brand-gradient rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {text && (
        <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">
          {t('common.loading')}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;