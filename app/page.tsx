'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import PostComposer from './components/PostComposer';
import PostFeed, { Post } from './components/PostFeed';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CommunitiesSection from './components/CommunitiesSection';
import FeaturesSection from './components/FeaturesSection';
import AboutSection from './components/AboutSection';
import { SpiderManHeaderDoodle } from './components/SpiderManDoodle';
import { MessageSquare, Users, Gamepad2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

export default function Home() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState<Post[]>([]);
  // Default to true so users can see the app right away without login
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          replies (*)
        `)
        .order('created_at', { ascending: false });

      if (data && data.length > 0 && !error) {
        setPosts(data as Post[]);
      }
    } catch (err) {
      console.warn('Supabase fetch posts error:', err);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Determine whether to show the Feed Dashboard or the Landing Page
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
        {/* Top Navbar */}
        <Navbar />

        {/* Hero Section */}
        <HeroSection />

        {/* Banner to preview feed or sign in */}
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

        {/* Communities Section */}
        <CommunitiesSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* About Section */}
        <AboutSection />
      </main>
    );
  }

  // 2. WHEN LOGGED IN (OR IN DEMO PREVIEW): Show Cohort App Feed Dashboard
  return (
    <div className="min-h-screen cohort-doodle-bg flex">
      {/* Left Sidebar Navbar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '160px', display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f6f7fa' }}>
        {/* Top Sticky Header */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          backgroundColor: 'rgba(246,247,250,0.9)',
          backdropFilter: 'blur(10px)',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
            {/* Spider-Man Header Doodle */}
            <SpiderManHeaderDoodle />

            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '2px', fontFamily: 'monospace', marginLeft: '8px' }}>
              <span style={{ color: '#94a3b8', fontWeight: 400 }}>c/</span>
              <span>{activeTab === 'home' ? 'home' : activeTab}</span>
            </h1>
          </div>

          {!user && (
            <button
              onClick={signInWithGoogle}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
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

        {/* Main Body Section */}
        <main style={{ flex: 1, maxWidth: '640px', width: '100%', margin: '0 auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeTab === 'home' && (
            <>
              {/* Post Composer */}
              <PostComposer onPostCreated={handlePostCreated} />

              {/* Feed List */}
              <PostFeed posts={posts} setPosts={setPosts} />
            </>
          )}

          {activeTab === 'communities' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-sm">
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-sm">
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{activeTab}</h2>
              <p className="text-sm text-slate-500">
                Welcome to the {activeTab} section of Cohort. Sign in with Google to personalize your profile.
              </p>
            </div>
          )}
        </main>

        {/* Floating Chat Button (Bottom Right) */}
        <div className="fixed bottom-6 right-6 z-40">
          <button className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 p-0.5 border border-purple-200 dark:border-purple-800 shadow-lg hover:scale-105 transition-all group flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center">
              <MessageSquare size={19} className="group-hover:rotate-6 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
