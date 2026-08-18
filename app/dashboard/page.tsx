'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/app/components/Sidebar';
import RightSidebar from '@/app/components/RightSidebar';
import PostComposer from '@/app/components/PostComposer';
import PostFeed, { Post } from '@/app/components/PostFeed';
import CommunitiesPage from '@/app/components/CommunitiesPage';
import ProfilePage from '@/app/components/ProfilePage';
import {
  MessageSquare,
  Users,
  Gamepad2,
  Bell,
  MapPin,
  Calendar,
  Zap,
  Handshake,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [supabaseReady, setSupabaseReady] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const supabase = createClient();

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      if (!url || url.includes('placeholder')) {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-500">Loading Cohort Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cohort-doodle-bg flex justify-between">
      {/* Left Sidebar Navbar (Collapsible & Expandable on hover) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isHovered={isSidebarHovered}
        setIsHovered={setIsSidebarHovered}
      />

      {/* Middle Column (Center Content) */}
      <div
        style={{
          marginLeft: isSidebarHovered ? '230px' : '72px',
          flex: 1,
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          minWidth: 0,
        }}
      >
        <main
          style={{
            flex: 1,
            maxWidth: activeTab === 'communities' ? '880px' : '740px',
            width: '100%',
            margin: '0 auto',
            padding: '28px 24px 64px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* TAB 1: HOME FEED */}
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
                      Supabase database table ready
                    </p>
                    <p style={{ fontSize: '12.5px', color: '#78350f', lineHeight: 1.5, margin: 0 }}>
                      Make sure the SQL schema in <code style={{ background: '#fef3c7', padding: '1px 5px', borderRadius: '4px', fontFamily: 'monospace' }}>supabase/schema.sql</code> is executed in your Supabase SQL Editor to start saving live posts.
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

              {!loadingPosts && posts.length === 0 && (
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

          {/* TAB 2: COMMUNITIES (Vedant's new Communities component) */}
          {activeTab === 'communities' && (
            <CommunitiesPage />
          )}

          {/* TAB 3: PROFILE (Vedant's new Profile component) */}
          {activeTab === 'profile' && (
            <ProfilePage />
          )}

          {/* TAB 4: ARCADE */}
          {activeTab === 'arcade' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Gamepad2 size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Cohort Arcade</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Break room mini-games and campus leaderboard challenges for students during study breaks!
              </p>
            </div>
          )}

          {/* TAB 5: FRIENDS */}
          {activeTab === 'friends' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Handshake size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Campus Friends</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Connect and stay in touch with your PCCOE classmates and peers.
              </p>
            </div>
          )}

          {/* TAB 6: CONNECT */}
          {activeTab === 'connect' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <MessageSquare size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Encrypted Messaging</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Real-time private and group discussions for PCCOE students.
              </p>
            </div>
          )}

          {/* TAB 7: XD (Anonymous Board) */}
          {activeTab === 'xd' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Zap size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">XD (Exchange)</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Anonymous campus confessions, honest reviews, and open exchange board.
              </p>
            </div>
          )}

          {/* TAB 8: MAP */}
          {activeTab === 'map' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <MapPin size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">PCCOE Campus Navigation</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Interactive campus maps to locate classrooms, labs, departments, and food courts.
              </p>
            </div>
          )}

          {/* TAB 9: CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Calendar size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Academic Calendar</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Track semester exams, submissions, university holidays, and event schedules.
              </p>
            </div>
          )}

          {/* TAB 10: HEADSUP */}
          {activeTab === 'headsup' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                <Bell size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">HeadsUp Alerts & Notices</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Important college announcements, placement drives, and urgent campus alerts.
              </p>
            </div>
          )}

          {/* TAB 11: CONTACT */}
          {activeTab === 'contact' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <MessageCircle size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Contact Cohort Team</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Have feedback or want to report an issue? Reach out to the student development team.
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
  );
}
