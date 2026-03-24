import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  FolderIcon, 
  EnvelopeIcon, 
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { 
  teamAPI, 
  projectsAPI, 
  contactAPI, 
  authAPI, 
  handleApiError 
} from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';
import { useApp } from '../../contexts/AppContext';
import AdminContacts from './AdminContacts'; // استخدم الملف الموجود لديك لإدارة الرسائل

const Dashbord = () => {
  const { darkMode, setDarkMode } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    team: { total: 0, active: 0 },
    projects: { total: 0, featured: 0 },
    contacts: { total: 0, new: 0 }
  });

  // Authentication check
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.checkStatus();
      if (response.data.authenticated && response.data.user?.role === 'admin') {
        setUser(response.data.user);
        setIsAuthenticated(true);
        fetchStats();
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authAPI.login(loginForm);
      if (response.data.data.user.role === 'admin') {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        toast.success('تم تسجيل الدخول بنجاح');
        fetchStats();
      } else {
        toast.error('ليس لديك صلاحيات إدارية');
      }
    } catch (error) {
      const errorInfo = handleApiError(error);
      toast.error(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [teamStats, projectStats, contactStats] = await Promise.all([
        teamAPI.getStats(),
        projectsAPI.getStats(),
        contactAPI.getStats()
      ]);

      setStats({
        team: teamStats.data.data,
        projects: projectStats.data.data,
        contacts: contactStats.data.data
      });
    } catch (error) {
      const errorInfo = handleApiError(error);
      toast.error(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  // Login form if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>لوحة الإدارة - Shift Start</title>
        </Helmet>
        
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                لوحة الإدارة
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                قم بتسجيل الدخول للوصول إلى لوحة التحكم
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="admin@shiftstart.sy"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-gradient text-white py-2 px-4 rounded-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </button>
            </form>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>لوحة الإدارة - Shift Start</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              لوحة الإدارة
            </h1>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <span className="text-gray-600 dark:text-gray-400">
                مرحباً، {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                تسجيل الخروج
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                {darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8 rtl:space-x-reverse">
              {[
                { key: 'dashboard', label: 'لوحة المعلومات', icon: ChartBarIcon },
                { key: 'team', label: 'الفريق', icon: UserGroupIcon },
                { key: 'projects', label: 'المشاريع', icon: FolderIcon },
                { key: 'contacts', label: 'الرسائل', icon: EnvelopeIcon }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.key
                      ? 'bg-brand-red text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Dashboard Content */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Stats Cards */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <UserGroupIcon className="h-8 w-8 text-blue-500" />
                  <div className="mr-4 rtl:ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      أعضاء الفريق
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.team.active} / {stats.team.total}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <FolderIcon className="h-8 w-8 text-green-500" />
                  <div className="mr-4 rtl:ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      المشاريع
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.projects.featured} / {stats.projects.total}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-8 w-8 text-purple-500" />
                  <div className="mr-4 rtl:ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      الرسائل الجديدة
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.contacts.new} / {stats.contacts.total}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
              <p className="text-gray-600 dark:text-gray-400">
                إدارة الفريق ستتم إضافتها قريباً
              </p>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
              <p className="text-gray-600 dark:text-gray-400">
                إدارة المشاريع ستتم إضافتها قريباً
              </p>
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <AdminContacts />
            </div>
          )}

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashbord;
