'use client';

import React, { useState, useEffect } from 'react';
import {
  Home,
  Users,
  Handshake,
  MessageSquare,
  Zap,
  MapPin,
  Calendar,
  Gamepad2,
  Bell,
  MessageCircle,
  User,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { user, profile, signInWithGoogle, signOut, loading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('cohort-theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
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
    { id: 'communities', label: 'Communities', icon: Users, badge: '2', badgeType: 'circle' },
    { id: 'friends', label: 'Friends', icon: Handshake, badge: null },
    { id: 'connect', label: 'Connect', icon: MessageSquare, badge: null },
    { id: 'xd', label: 'XD', icon: Zap, badge: null },
    { id: 'map', label: 'Map', icon: MapPin, badge: null },
    { id: 'calendar', label: 'Calendar', icon: Calendar, badge: null },
    { id: 'arcade', label: 'Arcade', icon: Gamepad2, badge: null },
    { id: 'headsup', label: 'HeadsUp', icon: Bell, badge: '99+', badgeType: 'pill' },
    { id: 'contact', label: 'Contact Us', icon: MessageCircle, badge: null },
    { id: 'profile', label: 'Profile', icon: User, badge: null },
  ];

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="url(#grad-m)" strokeWidth="2.5" fill="none" />
            <circle cx="9" cy="14" r="3.8" fill="#2563EB" />
            <circle cx="19" cy="14" r="3.8" fill="#EC4899" />
            <circle cx="14" cy="10" r="3.8" fill="#06B6D4" />
            <circle cx="14" cy="18" r="3.8" fill="#F59E0B" />
            <defs>
              <linearGradient id="grad-m" x1="0" y1="0" x2="28" y2="28">
                <stop stopColor="#2563EB" />
                <stop offset="1" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-bold text-lg text-slate-900 dark:text-white">cohort</span>
          <span className="text-xs text-slate-400 font-mono">c/home</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Left Navigation Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          width: '210px',
          backgroundColor: '#f7f8fa',
          borderRight: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        {/* Top Logo & Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 pt-6 pb-4 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {/* Brand Logo Header */}
          <div className="flex items-center gap-2.5 px-2 mb-6">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="flex-shrink-0">
              <circle cx="14" cy="14" r="13" stroke="url(#grad-side)" strokeWidth="2.5" fill="none" />
              <circle cx="9" cy="14" r="3.8" fill="#2563EB" />
              <circle cx="19" cy="14" r="3.8" fill="#E11D48" />
              <circle cx="14" cy="9.8" fill="#06B6D4" />
              <circle cx="14" cy="18.2" fill="#F59E0B" />
              <defs>
                <linearGradient id="grad-side" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#2563EB" />
                  <stop offset="0.5" stopColor="#E11D48" />
                  <stop offset="1" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontWeight: 700, fontSize: '19px', color: '#0f172a', letterSpacing: '-0.3px' }}>
              cohort
            </span>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14.5px',
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? '#2060E8' : 'transparent',
                    color: isActive ? '#ffffff' : '#4b5563',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 3px 10px rgba(32, 96, 232, 0.25)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,0,0,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.3 : 1.8}
                        style={{ color: isActive ? '#ffffff' : '#556477', flexShrink: 0 }}
                      />
                      {/* Attached icon badge if badgeType === 'circle' (like Communities) */}
                      {item.badge && item.badgeType === 'circle' && !isActive && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-6px',
                            width: '15px',
                            height: '15px',
                            borderRadius: '50%',
                            backgroundColor: '#EF4444',
                            color: '#ffffff',
                            fontSize: '9.5px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: 1,
                            border: '1.5px solid #f7f8fa',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span>{item.label}</span>
                  </div>

                  {/* Right pill badge if badgeType === 'pill' (like HeadsUp 99+) */}
                  {item.badge && item.badgeType === 'pill' && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '9999px',
                        backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#EF4444',
                        color: '#ffffff',
                        lineHeight: '14px',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Theme Toggle & User Auth */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(0,0,0,0.06)', backgroundColor: 'transparent' }}>
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
              fontSize: '13.5px',
              fontWeight: 500,
              color: '#556477',
              backgroundColor: 'transparent',
              marginBottom: user ? '8px' : '0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {darkMode ? <Sun size={17} style={{ color: '#f59e0b' }} /> : <Moon size={17} style={{ color: '#6b7280' }} />}
              <span>{darkMode ? 'Light mode' : 'Dark mode'}</span>
            </div>
            <div
              style={{
                width: '34px',
                height: '18px',
                borderRadius: '9999px',
                padding: '2px',
                backgroundColor: darkMode ? '#2060E8' : '#d1d5db',
                transition: 'background-color 0.2s',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '9999px',
                  backgroundColor: '#ffffff',
                  transform: darkMode ? 'translateX(16px)' : 'translateX(0)',
                  transition: 'transform 0.2s',
                }}
              />
            </div>
          </button>

          {/* User Account Info / Sign In */}
          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                padding: '8px 10px',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.06)',
                marginTop: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'User'}
                    style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: '#2060E8',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: '11.5px', fontWeight: 600, color: '#1e293b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {profile?.full_name || 'User'}
                  </p>
                  <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    @{profile?.username || 'user'}
                  </p>
                </div>
              </div>

              <button
                onClick={signOut}
                title="Sign out"
                style={{
                  padding: '5px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                }}
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
