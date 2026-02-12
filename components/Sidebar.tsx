
import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT] },
    { id: 'students', label: 'Students', roles: [UserRole.ADMIN, UserRole.TEACHER] },
    { id: 'data-entry', label: 'Update Progress', roles: [UserRole.ADMIN, UserRole.TEACHER] },
    { id: 'analysis', label: 'Performance Review', roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT] },
    { id: 'tools', label: 'Learning Tools', roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT] },
    { id: 'settings', label: 'Settings', roles: [UserRole.ADMIN] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="w-72 bg-slate-900 h-screen text-slate-300 flex flex-col fixed left-0 top-0 z-20 border-r border-slate-800">
      <div className="p-8">
        <h1 className="text-xl font-outfit font-black tracking-tight text-white uppercase">
          SELLO <span className="text-indigo-400 font-light underline decoration-indigo-500/50 underline-offset-4">PORTAL</span>
        </h1>
        <div className="h-px w-full bg-slate-800 mt-4"></div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left px-4 py-3 text-sm font-semibold tracking-wide transition-all duration-300 rounded-lg ${
              activeTab === item.id 
                ? 'bg-slate-800 text-white border-l-4 border-indigo-500 shadow-lg' 
                : 'hover:bg-slate-800/50 hover:text-slate-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-8 space-y-4">
        <div className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
          SECURE SESSION
        </div>
        <button 
          onClick={onLogout}
          className="w-full py-2 text-left text-sm font-semibold text-slate-400 hover:text-red-400 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
