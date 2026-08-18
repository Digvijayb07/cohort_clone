'use client';

import React, { useState, useEffect } from 'react';
import {
  Home,
  Users,
  UserCheck,
  MessageCircle,
  Zap,
  MapPin,
  Calendar,
  Gamepad2,
  Bell,
  Mail,
  User,
  Moon,
  Sun,
  LogOut,
  LogIn,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SpiderManSidebarDoodle } from './SpiderManDoodle';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { user, profile, signInWithGoogle, signOut, loading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Only use explicitly saved preference — NEVER auto-detect system dark mode
    const savedTheme = localStorage.getItem('cohort-theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      // Default to LIGHT mode always
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
      if (!savedTheme) {
        localStorage.setItem('cohort-theme', 'light');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cohort-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cohort-theme', 'light');
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, badge: null },
    { id: 'communities', label: 'Communities', icon: Users, badge: '2' },
    { id: 'friends', label: 'Friends', icon: UserCheck, badge: null },
    { id: 'connect', label: 'Connect', icon: MessageCircle, badge: null },
    { id: 'xd', label: 'XD', icon: Zap, badge: null },
    { id: 'map', label: 'Map', icon: MapPin, badge: null },
    { id: 'calendar', label: 'Calendar', icon: Calendar, badge: null, doodleType: 'calendar' as const },
    { id: 'arcade', label: 'Arcade', icon: Gamepad2, badge: null },
    { id: 'headsup', label: 'HeadsUp', icon: Bell, badge: '99+' },
    { id: 'contact', label: 'Contact Us', icon: Mail, badge: null },
    { id: 'profile', label: 'Profile', icon: User, badge: null, doodleType: 'profile' as const },
  ];

  return (
    <>
      {/* Mobile Top Header & Hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="url(#grad-m)" strokeWidth="2.5" fill="none" />
            <circle cx="9" cy="14" r="4" fill="#2563EB" />
            <circle cx="19" cy="14" r="4" fill="#EC4899" />
            <circle cx="14" cy="10" r="4" fill="#06B6D4" />
            <circle cx="14" cy="18" r="4" fill="#F59E0B" />
            <defs>
              <linearGradient id="grad-m" x1="0" y1="0" x2="28" y2="28">
                <stop stopColor="#2563EB" />
                <stop offset="1" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-semibold text-lg text-slate-900 dark:text-white">cohort</span>
          <span className="text-xs text-slate-400 font-medium">c/home</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '160px', backgroundColor: '#f4f5f8', borderRight: '1px solid rgba(0,0,0,0.07)' }}
      >
        {/* Top Header & Nav list */}
        <div className="flex-1 overflow-y-auto px-3 pt-5 pb-4" style={{ overflowX: 'hidden' }}>
          {/* Logo Header */}
          <div className="flex items-center gap-2 px-1 mb-5">
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="url(#grad-side)" strokeWidth="2" fill="none" />
              <circle cx="9" cy="14" r="3.5" fill="#2563EB" />
              <circle cx="19" cy="14" r="3.5" fill="#EC4899" />
              <circle cx="14" cy="10" r="3.5" fill="#06B6D4" />
              <circle cx="14" cy="18" r="3.5" fill="#F59E0B" />
              <defs>
                <linearGradient id="grad-side" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#2563EB" />
                  <stop offset="1" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontWeight: 700, fontSize: '17px', color: '#1e293b', letterSpacing: '-0.3px' }}>cohort</span>
          </div>

          {/* Nav Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <div key={item.id} style={{ position: 'relative' }}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '13.5px',
                      fontWeight: isActive ? 600 : 500,
                      backgroundColor: isActive ? '#2563EB' : 'transparent',
                      color: isActive ? '#ffffff' : '#4b5563',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,0,0,0.05)'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon
                        size={17}
                        style={{ color: isActive ? '#ffffff' : '#6b7280', flexShrink: 0 }}
                      />
                      <span>{item.label}</span>
                    </div>

                    {/* Badge */}
                    {item.badge && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '1px 5px',
                        borderRadius: '9999px',
                        backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#EF4444',
                        color: '#ffffff',
                        lineHeight: '16px',
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {/* SpiderMan Sticker on Calendar & Profile */}
                  {item.doodleType && <SpiderManSidebarDoodle type={item.doodleType} />}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Theme & Auth */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(0,0,0,0.07)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              color: '#4b5563',
              backgroundColor: 'transparent',
              marginBottom: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {darkMode ? <Sun size={16} style={{ color: '#f59e0b' }} /> : <Moon size={16} style={{ color: '#6b7280' }} />}
              <span>{darkMode ? 'Light mode' : 'Dark mode'}</span>
            </div>
            <div style={{
              width: '34px', height: '18px', borderRadius: '9999px', padding: '2px',
              backgroundColor: darkMode ? '#2563EB' : '#cbd5e1',
              transition: 'background-color 0.2s',
              position: 'relative',
            }}>
              <div style={{
                width: '14px', height: '14px', borderRadius: '9999px',
                backgroundColor: '#ffffff',
                transform: darkMode ? 'translateX(16px)' : 'translateX(0)',
                transition: 'transform 0.2s',
              }} />
            </div>
          </button>

          {/* User Auth Section */}
          <div className="pt-1">
            {user ? (
              <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || 'User Avatar'}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {profile?.full_name || 'User'}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                      @{profile?.username || 'user'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={signOut}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors ml-1"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all hover:shadow-lg active:scale-[0.98]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="bg-white rounded-full p-0.5">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
