import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Bird, MessageCircle, Moon, BookOpen,
  Flower2, Wind, Brain, Sparkles, BarChart3,
  Settings, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const navItems = [
  ['/dashboard', 'Home', Home],
  ['/ask-krishna', 'Ask Krishna', Bird],
  ['/talk', 'Talk to Sukoon', MessageCircle],
  ['/mood', 'Mood', Moon],
  ['/journal', 'Journal', BookOpen],
  ['/gratitude', 'Gratitude Garden', Flower2],
  ['/breathe', 'Breathe', Wind],
  ['/unload', 'Unload Your Mind', Brain],
  ['/sleep', 'Sleep', Sparkles],
  ['/insights', 'Insights', BarChart3],
];

const NavItem = ({ to, label, Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative flex h-11 items-center gap-3 rounded-xl px-3 text-[13px] transition ${
        isActive
          ? 'bg-gradient-to-r from-pink-100 via-fuchsia-50 to-violet-100 font-medium text-[#A64D79] shadow-sm'
          : 'text-slate-500 hover:bg-pink-50 hover:text-pink-600'
      }`
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <span className="absolute left-0 h-6 w-[3px] rounded-r-full bg-gradient-to-b from-pink-500 to-violet-500" />
        )}

        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
            isActive
              ? 'bg-white text-pink-500 shadow-sm'
              : 'text-slate-400'
          }`}
        >
          <Icon size={17} />
        </span>

        <span className="truncate">{label}</span>
      </>
    )}
  </NavLink>
);

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="hidden w-[240px] shrink-0 self-stretch border-r border-pink-100 bg-gradient-to-b from-[#FFF4FA] via-[#FFF8FC] to-[#F3EEFF] shadow-[5px_0_25px_rgba(190,100,150,0.06)] md:flex md:flex-col">

      <div className="flex min-h-full flex-1 flex-col">

        {/* LOGO */}
        <div className="px-5 pb-4 pt-9">
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-pink-200 bg-gradient-to-br from-pink-100 via-fuchsia-100 to-violet-100 text-2xl shadow-sm">
              🪷
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-semibold tracking-wide text-[#A64D79]">
                  Sukoon
                </h1>
                <span className="text-xs">✨</span>
              </div>

              <p className="text-[10px] text-slate-400">
                Your peaceful space
              </p>
            </div>

          </div>
        </div>

        <div className="mx-5 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent" />

        {/* NAVIGATION */}
        <p className="px-5 pb-2 pt-4 text-[9px] font-semibold uppercase tracking-[.2em] text-pink-700/60">
          Your Space
        </p>

        <nav className="space-y-1 px-3">
          {navItems.map(([to, label, Icon]) => (
            <NavItem
              key={to}
              to={to}
              label={label}
              Icon={Icon}
            />
          ))}
        </nav>

        <div className="min-h-4 flex-1" />

        {/* BOTTOM */}
        <div className="mt-4 border-t border-pink-100 bg-white/30 px-3 pb-5 pt-3">

          <NavItem
            to="/settings"
            label="Settings"
            Icon={Settings}
          />

          {/* PROFILE */}
          <button
            onClick={() => navigate('/profile')}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-pink-50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-400 to-violet-500 p-[2px]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-xs font-semibold text-pink-600">
                {user?.name?.[0]?.toUpperCase() || 'S'}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-slate-600">
                {user?.name || 'Profile'}
              </p>
              <p className="text-[9px] text-slate-400">
                View your journey
              </p>
            </div>
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="mt-1 flex h-10 w-full items-center gap-3 rounded-xl px-3 text-[13px] text-slate-400 transition hover:bg-red-50 hover:text-red-400"
          >
            <span className="flex h-8 w-8 items-center justify-center">
              <LogOut size={17} />
            </span>
            Logout
          </button>

          <div className="mt-3 flex items-center justify-center gap-2 text-[9px] text-pink-300">
            <span>🦚</span>
            <span>•</span>
            <span>Sukoon</span>
            <span>•</span>
            <span>🪷</span>
          </div>

        </div>
      </div>
    </aside>
  );
};

export default Sidebar;