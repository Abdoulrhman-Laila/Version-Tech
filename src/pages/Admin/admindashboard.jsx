import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  FolderIcon, 
  EnvelopeIcon, 
  ChartBarIcon
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
import AdminContacts from './admincontacts'; // استخدم الملف الموجود لديك لإدارة الرسائل

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
        
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100/95 to-primary-200/80 dark:from-primary-900 dark:via-primary-800 dark:to-primary-900">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(111,106,240,0.22),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(77,59,255,0.18),transparent)]" />
            <div className="absolute -left-16 top-24 h-56 w-56 rounded-full bg-primary-500/15 blur-3xl dark:bg-primary-600/10" />
            <div className="absolute -right-16 bottom-20 h-48 w-48 rounded-full bg-primary-400/20 blur-3xl dark:bg-primary-500/10" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass relative z-10 mx-4 w-full max-w-md space-y-8 rounded-2xl p-8 shadow-medium ring-1 ring-primary-500/10 dark:ring-primary-400/15"
          >
            <div className="text-center">
              <h2 className="gradient-text text-3xl font-bold tracking-tight">
                لوحة الإدارة
              </h2>
              <p className="mt-2 text-primary-700/90 dark:text-primary-200/85">
                قم بتسجيل الدخول للوصول إلى لوحة التحكم
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  className="form-input"
                  placeholder="admin@shiftstart.sy"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="btn-gradient hover-lift w-full py-3 disabled:pointer-events-none disabled:opacity-50"
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

      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100/90 to-primary-200/70 dark:from-primary-900 dark:via-primary-800 dark:to-primary-900">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_80%_0%,rgba(111,106,240,0.12),transparent)] dark:bg-[radial-gradient(ellipse_70%_45%_at_80%_0%,rgba(77,59,255,0.12),transparent)]" />
          <div className="absolute -left-20 top-40 h-64 w-64 rounded-full bg-primary-500/15 blur-3xl dark:bg-primary-600/10" />
          <div className="absolute -right-16 bottom-20 h-48 w-48 rounded-full bg-primary-400/20 blur-3xl dark:bg-primary-500/10" />
        </div>

        {/* Header */}
        <header className="glass relative z-10 border-b border-primary-200/60 shadow-soft dark:border-primary-700/50">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <h1 className="gradient-text text-xl font-bold tracking-tight md:text-2xl">
              لوحة الإدارة
            </h1>
            <div className="flex items-center gap-3 rtl:flex-row-reverse sm:gap-4">
              <span className="hidden text-sm text-primary-700 dark:text-primary-200 sm:inline">
                مرحباً، {user?.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-red-400/50 bg-red-50/90 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-500/40 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/50"
              >
                تسجيل الخروج
              </button>
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className="btn-ghost btn-sm rounded-lg border border-primary-200 bg-primary-50/80 text-primary-800 dark:border-primary-600 dark:bg-primary-900/50 dark:text-primary-100"
              >
                {darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
              </button>
            </div>
          </div>
        </header>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Navigation Tabs */}
          <div className="mb-8">
            <nav className="flex flex-wrap gap-2 sm:gap-3">
              {[
                { key: 'dashboard', label: 'لوحة المعلومات', icon: ChartBarIcon },
                { key: 'team', label: 'الفريق', icon: UserGroupIcon },
                { key: 'projects', label: 'المشاريع', icon: FolderIcon },
                { key: 'contacts', label: 'الرسائل', icon: EnvelopeIcon }
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-primary-gradient text-primary-50 shadow-soft ring-1 ring-primary-500/30 dark:ring-primary-400/25'
                      : 'border border-primary-200/80 bg-white/70 text-primary-800 hover:bg-primary-100/90 hover:border-primary-300 dark:border-primary-600/60 dark:bg-primary-900/40 dark:text-primary-100 dark:hover:bg-primary-800/50'
                  }`}
                >
                  <tab.icon className="h-5 w-5 shrink-0 opacity-95" />
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
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {/* Stats Cards */}
              <div className="card hover-lift p-6 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-800/80">
                    <UserGroupIcon className="h-7 w-7 text-primary-600 dark:text-primary-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary-700/90 dark:text-primary-200/90">
                      أعضاء الفريق
                    </p>
                    <p className="text-2xl font-bold text-primary-900 dark:text-primary-50">
                      {stats.team.active} / {stats.team.total}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card hover-lift p-6 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-800/80">
                    <FolderIcon className="h-7 w-7 text-primary-600 dark:text-primary-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary-700/90 dark:text-primary-200/90">
                      المشاريع
                    </p>
                    <p className="text-2xl font-bold text-primary-900 dark:text-primary-50">
                      {stats.projects.featured} / {stats.projects.total}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card hover-lift p-6 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-800/80">
                    <EnvelopeIcon className="h-7 w-7 text-primary-600 dark:text-primary-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary-700/90 dark:text-primary-200/90">
                      الرسائل الجديدة
                    </p>
                    <p className="text-2xl font-bold text-primary-900 dark:text-primary-50">
                      {stats.contacts.new} / {stats.contacts.total}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="card p-8 shadow-soft">
              <p className="text-primary-700 dark:text-primary-200">
                إدارة الفريق ستتم إضافتها قريباً
              </p>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="card p-8 shadow-soft">
              <p className="text-primary-700 dark:text-primary-200">
                إدارة المشاريع ستتم إضافتها قريباً
              </p>
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div className="card overflow-hidden p-4 shadow-soft sm:p-6">
              <AdminContacts />
            </div>
          )}

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/45 backdrop-blur-sm dark:bg-primary-900/70">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashbord;
