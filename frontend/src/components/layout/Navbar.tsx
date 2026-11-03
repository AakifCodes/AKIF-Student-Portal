import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout, setCredentials } from '../../features/auth/authSlice';
import { useGetNotificationsQuery, useMarkNotificationReadMutation, useLoginMutation } from '../../services/apiSlice';
import { 
  Bell, 
  Menu, 
  User as UserIcon, 
  LogOut, 
  ShieldCheck, 
  GraduationCap, 
  ChevronDown, 
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { data: notifications = [] } = useGetNotificationsQuery(undefined, {
    skip: !user,
  });
  const [markRead] = useMarkNotificationReadMutation();
  const [login] = useLoginMutation();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleQuickSwitchRole = async (targetRole: 'ADMIN' | 'STUDENT') => {
    try {
      const email = targetRole === 'ADMIN' ? 'admin@uit.edu' : 'akif.24sp028@student.uitu.edu.pk';
      const password = targetRole === 'ADMIN' ? 'Admin@123' : 'Akif@123';
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      setShowUserMenu(false);
      navigate(targetRole === 'ADMIN' ? '/admin' : '/student');
    } catch (err) {
      console.error('Failed to switch role', err);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur shadow-xs sm:px-6">
      {/* Left: Mobile Toggle & University Portal Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-hidden lg:hidden"
          title="Toggle Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          eDU SMARTZ • UIT University
        </div>
      </div>

      {/* Right: Date, Notifications, Quick Role Switcher, Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Date Display matching Screenshot 12 */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-700 transition-colors focus:outline-hidden"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <h4 className="font-semibold text-sm text-slate-800">Academic Notifications</h4>
                <span className="text-xs text-blue-600 font-medium">{unreadCount} unread</span>
              </div>
              <div className="max-h-72 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No notifications at this time.</p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => !item.read && markRead(item.id)}
                      className={`cursor-pointer rounded-lg p-2.5 text-xs transition-colors ${
                        item.read ? 'bg-slate-50 text-slate-600' : 'bg-blue-50/70 border border-blue-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-blue-900">{item.title}</span>
                        {!item.read && <span className="h-2 w-2 rounded-full bg-blue-600"></span>}
                      </div>
                      <p className="mt-1 text-slate-600 leading-relaxed">{item.message}</p>
                      <span className="mt-1 inline-block text-[10px] text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Pill / Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50/80 py-1.5 pl-2.5 pr-3 hover:bg-slate-100 transition-colors focus:outline-hidden"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-sm font-bold text-white shadow-xs">
              {user?.role === 'ADMIN' ? 'A' : 'M'}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {user?.role === 'ADMIN' ? 'Administrator' : 'MUHAMMAD AKIF ALVI'}
              </p>
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    user?.role === 'ADMIN' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                ></span>
                <p className="text-[10px] font-medium text-slate-500">
                  {user?.role === 'ADMIN' ? 'PORTAL ADMIN' : '24SP-028-SE'}
                </p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
              <div className="border-b border-slate-100 px-3 py-2 text-xs">
                <p className="font-semibold text-slate-800">{user?.name}</p>
                <p className="text-slate-500 truncate">{user?.email}</p>
                <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                  {user?.role === 'ADMIN' ? (
                    <><ShieldCheck className="h-3 w-3" /> ROLE: ADMIN</>
                  ) : (
                    <><GraduationCap className="h-3 w-3" /> ROLE: STUDENT</>
                  )}
                </div>
              </div>

              {/* Fast 1-Click Role Switcher */}
              <div className="p-2 border-b border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                  Switch Active Role
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleQuickSwitchRole('STUDENT')}
                    className={`flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                      user?.role === 'STUDENT'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <GraduationCap className="h-3.5 w-3.5" /> Student
                  </button>
                  <button
                    onClick={() => handleQuickSwitchRole('ADMIN')}
                    className={`flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                      user?.role === 'ADMIN'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" /> Admin
                  </button>
                </div>
              </div>

              <div className="p-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
