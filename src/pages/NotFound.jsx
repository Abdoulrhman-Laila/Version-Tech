import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>404 - الصفحة غير موجودة | Shift Start</title>
        <meta name="description" content="الصفحة التي تبحث عنها غير موجودة. العودة إلى الصفحة الرئيسية" />
      </Helmet>

      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-red/10 via-brand-pink/10 to-brand-purple/10 dark:from-brand-red/5 dark:via-brand-pink/5 dark:to-brand-purple/5">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* 404 Animation */}
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: "backOut" }}
              className="mb-8"
            >
              <div className="relative">
                {/* Main 404 Number */}
                <h1 className="text-9xl md:text-[12rem] font-bold gradient-text opacity-20 select-none">
                  404
                </h1>
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-20, 20, -20] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="w-16 h-16 bg-brand-red/20 rounded-full blur-xl"></div>
                </motion.div>
                
                <motion.div
                  animate={{ y: [20, -20, 20] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-1/3 right-1/4 transform translate-x-1/2 -translate-y-1/2"
                >
                  <div className="w-12 h-12 bg-brand-pink/20 rounded-full blur-xl"></div>
                </motion.div>
                
                <motion.div
                  animate={{ y: [-15, 15, -15] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 translate-y-1/2"
                >
                  <div className="w-20 h-20 bg-brand-purple/20 rounded-full blur-xl"></div>
                </motion.div>
              </div>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                عذراً، الصفحة غير موجودة
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                يبدو أن الصفحة التي تبحث عنها قد انتقلت أو لم تعد موجودة. 
                لا تقلق، يمكنك العودة إلى الصفحة الرئيسية أو استكشاف أقسام أخرى من موقعنا.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link
                to="/"
                className="btn-gradient text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                العودة للرئيسية
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="px-8 py-4 rounded-lg font-semibold text-lg border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white transition-all duration-300"
              >
                العودة للخلف
              </button>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
            >
              {[
                { name: 'من نحن', path: '/about', icon: '👥' },
                { name: 'خدماتنا', path: '/services', icon: '🛠️' },
                { name: 'فريقنا', path: '/team', icon: '👨‍💻' },
                { name: 'تواصل معنا', path: '/contact', icon: '📞' },
              ].map((link, index) => (
                <motion.div
                  key={link.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={link.path}
                    className="block card p-4 text-center hover-lift group"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {link.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {link.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Fun Facts */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-16 p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl max-w-lg mx-auto"
            >
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                💡 هل تعلم؟
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                خطأ 404 يعني "غير موجود". هذا الرمز أصبح مشهوراً جداً حتى أن العديد من المواقع تصمم صفحات 404 إبداعية مثل هذه!
              </p>
            </motion.div>

            {/* Search Suggestion */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="mt-8"
            >
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                إذا كنت تعتقد أن هذا خطأ، يرجى <Link to="/contact" className="text-brand-red hover:underline">التواصل معنا</Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default NotFound;