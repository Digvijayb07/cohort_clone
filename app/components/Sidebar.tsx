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
  const { user, profile, signInWithGoogle, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

      {/* Left Collapsible & Expandable Navigation Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          width: isHovered || mobileOpen ? '210px' : '70px',
          backgroundColor: '#f7f8fa',
          borderRight: '1px solid rgba(0,0,0,0.06)',
          boxShadow: isHovered ? '4px 0 24px rgba(0,0,0,0.07)' : 'none',
          overflowX: 'hidden',
        }}
      >
        {/* Top Logo & Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 pt-6 pb-4 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {/* Brand Logo Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: isHovered ? '0 6px' : '0',
              justifyContent: isHovered ? 'flex-start' : 'center',
              marginBottom: '24px',
              transition: 'all 0.25s ease',
            }}
          >
            <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
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
            </div>
            {isHovered && (
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '19px',
                  color: '#0f172a',
                  letterSpacing: '-0.3px',
                  whiteSpace: 'nowrap',
                  animation: 'fadeIn 0.2s ease',
                }}
              >
                cohort
              </span>
            )}
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                  title={!isHovered ? item.label : undefined}
                  style={{
                    width: '100%',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isHovered ? 'space-between' : 'center',
                    padding: isHovered ? '0 14px' : '0',
                    borderRadius: isActive ? '14px' : '12px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14.5px',
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? '#2060E8' : 'transparent',
                    color: isActive ? '#ffffff' : '#4b5563',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isActive ? '0 3px 12px rgba(32, 96, 232, 0.25)' : 'none',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,0,0,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px' }}>
                      <Icon
                        size={20}
                        strokeWidth={isActive ? 2.3 : 1.8}
                        style={{ color: isActive ? '#ffffff' : '#556477', flexShrink: 0 }}
                      />
                      {/* Attached icon badge if badgeType === 'circle' (like Communities) */}
                      {item.badge && item.badgeType === 'circle' && !isActive && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-8px',
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

                      {/* Pill badge when collapsed (like HeadsUp 99+) */}
                      {!isHovered && item.badge && item.badgeType === 'pill' && !isActive && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-12px',
                            padding: '1px 4px',
                            borderRadius: '9999px',
                            backgroundColor: '#EF4444',
                            color: '#ffffff',
                            fontSize: '8.5px',
                            fontWeight: 700,
                            lineHeight: 1,
                            border: '1px solid #f7f8fa',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Label when expanded */}
                    {isHovered && (
                      <span style={{ whiteSpace: 'nowrap', animation: 'fadeIn 0.2s ease' }}>
                        {item.label}
                      </span>
                    )}
                  </div>

                  {/* Right pill badge when expanded */}
                  {isHovered && item.badge && item.badgeType === 'pill' && (
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

        {/* Bottom Section: Theme Toggle & User Account */}
        <div
          style={{
            padding: isHovered ? '14px 14px' : '14px 0',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            backgroundColor: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isHovered ? 'stretch' : 'center',
            transition: 'all 0.25s ease',
          }}
        >
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title="Dark mode"
            style={{
              width: isHovered ? '100%' : '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isHovered ? 'space-between' : 'center',
              padding: isHovered ? '0 12px' : '0',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13.5px',
              fontWeight: 500,
              color: '#556477',
              backgroundColor: 'transparent',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,0,0,0.04)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {darkMode ? <Sun size={19} style={{ color: '#f59e0b' }} /> : <Moon size={19} style={{ color: '#556477' }} />}
              {isHovered && <span style={{ whiteSpace: 'nowrap' }}>{darkMode ? 'Light mode' : 'Dark mode'}</span>}
            </div>
            {isHovered && (
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
            )}
          </button>

          {/* User Account Info when expanded */}
          {user && isHovered && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                padding: '8px 10px',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.06)',
                marginTop: '8px',
                animation: 'fadeIn 0.2s ease',
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
