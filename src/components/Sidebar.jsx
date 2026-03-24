import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-xl font-bold mb-6">لوحة التحكم</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/team">Team</Link>
        <Link to="/admin/projects">Projects</Link>
        <Link to="/admin/messages">Messages</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
