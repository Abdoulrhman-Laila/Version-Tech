import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  ChartBarIcon,
  UserGroupIcon,
  FolderIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { useApp } from "../../contexts/AppContext";

const navItems = [
  { to: "/admin/dashboard", label: "الرئيسية", icon: ChartBarIcon },
  { to: "/admin/team", label: "الفريق", icon: UserGroupIcon },
  { to: "/admin/projects", label: "المشاريع", icon: FolderIcon },
  { to: "/admin/contacts", label: "الرسائل", icon: EnvelopeIcon },
];

const AdminLayout = () => {
  const { darkMode, setDarkMode } = useApp();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100/90 to-primary-200/70 dark:from-primary-900 dark:via-primary-800 dark:to-primary-900 md:flex-row">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_0%_0%,rgba(111,106,240,0.14),transparent)] dark:bg-[radial-gradient(ellipse_55%_45%_at_0%_0%,rgba(77,59,255,0.12),transparent)]" />
        <div className="absolute -left-16 top-1/3 h-56 w-56 rounded-full bg-primary-500/12 blur-3xl dark:bg-primary-600/10" />
        <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-primary-400/15 blur-3xl dark:bg-primary-500/10" />
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-full shrink-0 border-b border-primary-200/70 p-4 shadow-soft md:w-64 md:min-h-screen md:border-b-0 md:border-r md:border-primary-200/70">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="gradient-text text-lg font-bold tracking-tight md:text-xl">
            لوحة التحكم
          </h2>
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="btn-ghost btn-sm rounded-lg border border-primary-200 bg-primary-50/80 text-primary-800 dark:border-primary-600 dark:bg-primary-900/50 dark:text-primary-100"
            aria-label={darkMode ? "الوضع النهاري" : "الوضع الليلي"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <nav className="flex flex-wrap gap-2 md:flex-col md:flex-nowrap md:gap-1.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin/dashboard"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 md:gap-3",
                  isActive
                    ? "bg-primary-gradient text-primary-50 shadow-soft ring-1 ring-primary-500/30 dark:ring-primary-400/25"
                    : "text-primary-800 hover:bg-primary-100/90 hover:border-primary-300 border border-transparent dark:text-primary-100 dark:hover:bg-primary-800/55",
                ].join(" ")
              }
            >
              <Icon className="h-5 w-5 shrink-0 opacity-95" aria-hidden />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="relative z-10 min-h-0 flex-1 overflow-auto p-4 text-primary-900 dark:text-primary-50 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
