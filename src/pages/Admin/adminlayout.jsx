import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";

const AdminLayout = () => {
  const { darkMode, setDarkMode } = useApp();

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"} transition-colors duration-300`}>
      
      {/* Sidebar */}
      <aside className={`w-64 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} shadow-md p-4 transition-colors duration-300`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">لوحة التحكم</h2>
          {/* زر تبديل الوضع */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-2 py-1 rounded text-sm ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} transition-colors`}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          <Link
            to="/admin/dashboard"
            className={`p-2 rounded transition-colors hover:${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
          >
            📊 الرئيسية
          </Link>
          <Link
            to="/admin/team"
            className={`p-2 rounded transition-colors hover:${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
          >
            👥 الفريق
          </Link>
          <Link
            to="/admin/projects"
            className={`p-2 rounded transition-colors hover:${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
          >
            📂 المشاريع
          </Link>
          <Link
            to="/admin/contacts"
            className={`p-2 rounded transition-colors hover:${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
          >
            📩 الرسائل
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className={`flex-1 p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} transition-colors duration-300`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
