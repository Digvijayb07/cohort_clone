'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import PostComposer from './components/PostComposer';
import PostFeed, { Post } from './components/PostFeed';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CommunitiesSection from './components/CommunitiesSection';
import FeaturesSection from './components/FeaturesSection';
import AboutSection from './components/AboutSection';
import { MessageSquare, Users, Gamepad2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

export default function Home() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [supabaseReady, setSupabaseReady] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const supabase = createClient();

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      if (!url || url.includes('your-supabase-project-id')) {
        setSupabaseReady(false);
        setLoadingPosts(false);
        return;
      }

      const { data, error } = await supabase
        .from('posts')
        .select(`
          id, author_id, author_name, author_handle, author_avatar,
          content, link_url, link_title, link_domain,
          likes_count, replies_count, created_at,
          replies (
            id, author_name, author_handle, author_avatar, content, created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error.message);
        setSupabaseReady(false);
      } else {
        setPosts((data as Post[]) || []);
        setSupabaseReady(true);
      }
    } catch (err) {
      console.warn('Supabase connection error:', err);
      setSupabaseReady(false);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const showDashboard = user || demoMode;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-500">Loading Cohort...</span>
        </div>
      </div>
    );
  }

  // 1. IF NOT LOGGED IN: Show Landing Page
  if (!showDashboard) {
    return (
      <main className="page-root">
        <Navbar />
        <HeroSection />

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-4 text-center text-white flex items-center justify-center gap-3 text-sm font-medium">
          <span>Ready to explore the PCCOE student platform?</span>
          <button
            onClick={() => setDemoMode(true)}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold backdrop-blur-sm transition-all"
          >
            Preview App Dashboard
          </button>
          <button
            onClick={signInWithGoogle}
            className="px-3 py-1 bg-white text-blue-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
          >
            <span>Sign in with Google</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <CommunitiesSection />
        <FeaturesSection />
        <AboutSection />
      </main>
    );
  }

  // 2. WHEN LOGGED IN: Show 3-Column Cohort App Dashboard
  return (
    <div className="min-h-screen cohort-doodle-bg flex">
      {/* Left Sidebar Navbar (Collapsible & Expandable on hover) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isHovered={isSidebarHovered}
        setIsHovered={setIsSidebarHovered}
      />

      {/* Main Content + Right Column Container (Smoothly adjusts margin when navbar expands) */}
      <div
        className="flex-1 flex flex-row min-h-screen transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          marginLeft: isSidebarHovered ? '210px' : '70px',
          backgroundColor: 'transparent',
        }}
      >
        {/* Center Feed Column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Sticky Header */}
          <header
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 30,
              backgroundColor: 'rgba(247, 248, 250, 0.85)',
              backdropFilter: 'blur(12px)',
              padding: '14px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1px',
                  fontFamily: 'monospace',
                  letterSpacing: '-0.3px',
                  margin: 0,
                }}
              >
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>c/</span>
                <span>{activeTab === 'home' ? 'home' : activeTab}</span>
              </h1>
            </div>

            {!user && (
              <button
                onClick={signInWithGoogle}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 16px',
                  backgroundColor: '#2060E8',
                  color: '#ffffff',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(32, 96, 232, 0.2)',
                  transition: 'all 0.15s',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Sign in with Google</span>
              </button>
            )}
          </header>

          {/* Main Feed Body */}
          <main
            style={{
              flex: 1,
              maxWidth: '680px',
              width: '100%',
              margin: '0 auto',
              padding: '24px 16px 48px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {activeTab === 'home' && (
              <>
                <PostComposer onPostCreated={handlePostCreated} />

                {!supabaseReady && !loadingPosts && (
                  <div
                    style={{
                      backgroundColor: '#fefce8',
                      border: '1px solid #fde68a',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <div style={{ fontSize: '22px', lineHeight: 1 }}>⚠️</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '13.5px', color: '#92400e', marginBottom: '4px' }}>
                        Supabase not connected
                      </p>
                      <p style={{ fontSize: '12.5px', color: '#78350f', lineHeight: 1.5, margin: 0 }}>
                        Open <code style={{ background: '#fef3c7', padding: '1px 5px', borderRadius: '4px', fontFamily: 'monospace' }}>.env.local</code> and replace the placeholder values with your real{' '}
                        <strong>NEXT_PUBLIC_SUPABASE_URL</strong> and <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong>.
                      </p>
                    </div>
                  </div>
                )}

                {loadingPosts && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid rgba(0,0,0,0.06)',
                          borderRadius: '16px',
                          padding: '20px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                          <div style={{ width: 42, height: 42, borderRadius: '50%', backgroundColor: '#e2e8f0', animation: 'pulse 1.5s infinite' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ height: 13, width: '35%', backgroundColor: '#e2e8f0', borderRadius: 6, marginBottom: 6 }} />
                            <div style={{ height: 10, width: '20%', backgroundColor: '#f1f5f9', borderRadius: 6 }} />
                          </div>
                        </div>
                        <div style={{ height: 12, backgroundColor: '#f1f5f9', borderRadius: 6, marginBottom: 8 }} />
                        <div style={{ height: 12, width: '75%', backgroundColor: '#f1f5f9', borderRadius: 6 }} />
                      </div>
                    ))}
                  </div>
                )}

                {!loadingPosts && supabaseReady && posts.length === 0 && (
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderRadius: '16px',
                      padding: '48px 24px',
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div style={{ fontSize: '42px', marginBottom: '12px' }}>✨</div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                      No posts yet
                    </h3>
                    <p style={{ fontSize: '13.5px', color: '#64748b', maxWidth: '320px', margin: '0 auto', lineHeight: 1.5, marginBottom: '16px' }}>
                      Be the first to share something with the Cohort community!
                    </p>
                  </div>
                )}

                {!loadingPosts && posts.length > 0 && (
                  <PostFeed posts={posts} setPosts={setPosts} />
                )}
              </>
            )}

            {activeTab === 'communities' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-sm">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Users size={28} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Communities</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Explore student clubs, tech chapters (ACM, GDGC, OWASP) and branch forums at PCCOE.
                </p>
              </div>
            )}

            {activeTab === 'arcade' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-sm">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Gamepad2 size={28} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Cohort Arcade</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Break room mini-games and leaderboard challenges for students during study breaks!
                </p>
              </div>
            )}

            {activeTab !== 'home' && activeTab !== 'communities' && activeTab !== 'arcade' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{activeTab}</h2>
                <p className="text-sm text-slate-500">
                  Welcome to the {activeTab} section of Cohort.
                </p>
              </div>
            )}
          </main>
        </div>

        {/* Right Sidebar Column (Search, C/COMMUNITIES, C/FRIENDS, C/CONNECT) */}
        <RightSidebar />

        {/* Floating Chat Widget Button (Bottom Right) */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '2px solid transparent',
              backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #a855f7, #3b82f6)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.25)',
              cursor: 'pointer',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.06)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7c3aed',
              }}
            >
              <MessageSquare size={18} strokeWidth={2.2} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
