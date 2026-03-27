import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AqiProvider } from '../../context/AqiContext';
import {
  HomeIcon, ClockIcon, UserIcon, ArrowRightOnRectangleIcon,
  Bars3Icon, XMarkIcon, WindIcon,
} from '@heroicons/react/24/outline';

const NAV = [
  { to: '/dashboard', icon: HomeIcon,  label: 'Dashboard' },
  { to: '/history',   icon: ClockIcon, label: 'History'   },
  { to: '/profile',   icon: UserIcon,  label: 'Profile'   },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg">🌬️</span>
        </div>
        <div>
          <p className="font-bold text-gray-900 text-base leading-none">Aeronexa</p>
          <p className="text-xs text-gray-400 mt-0.5">Air Quality Intelligence</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
               ${isActive
                 ? 'bg-blue-50 text-blue-700 font-semibold'
                 : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <AqiProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-gray-100 flex-shrink-0">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <aside className="relative w-64 bg-white flex flex-col shadow-xl z-10">
              <button className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600" onClick={() => setMobileOpen(false)}>
                <XMarkIcon className="w-5 h-5" />
              </button>
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile topbar */}
          <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
            <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
              <Bars3Icon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🌬️</span>
              </div>
              <span className="font-bold text-gray-900">Aeronexa</span>
            </div>
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AqiProvider>
  );
}
