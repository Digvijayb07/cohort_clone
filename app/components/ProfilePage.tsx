'use client';

import React, { useState, useEffect } from 'react';
import { Pencil, BarChart2, MessageSquare, Mail, LogOut, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

interface Stats {
  communities: number;
  followers: number;
  following: number;
  flex: number;
}

interface UserPost {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  replies_count: number;
}

interface UserReply {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
}

// SVG illustrations for stat cards
const CommunityIllustration = () => (
  <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="28" r="10" fill="#E8D5FF" stroke="#9B59B6" strokeWidth="2"/>
    <circle cx="50" cy="28" r="10" fill="#D5E8FF" stroke="#5B9BD5" strokeWidth="2"/>
    <circle cx="40" cy="20" r="10" fill="#FFE5D5" stroke="#E07B39" strokeWidth="2"/>
    <ellipse cx="30" cy="52" rx="14" ry="8" fill="#9B59B6" opacity="0.3"/>
    <ellipse cx="50" cy="52" rx="14" ry="8" fill="#5B9BD5" opacity="0.3"/>
  </svg>
);

const FollowerIllustration = () => (
  <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="40" width="60" height="30" rx="8" fill="#EEF2FF"/>
    <circle cx="25" cy="35" r="10" fill="#C7D2FE" stroke="#6366F1" strokeWidth="2"/>
    <circle cx="40" cy="30" r="12" fill="#A5B4FC" stroke="#4F46E5" strokeWidth="2"/>
    <circle cx="55" cy="35" r="10" fill="#C7D2FE" stroke="#6366F1" strokeWidth="2"/>
    <rect x="34" y="24" width="12" height="8" rx="4" fill="#FBBF24"/>
  </svg>
);

const FollowingIllustration = () => (
  <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="28" r="12" fill="#D1FAE5" stroke="#10B981" strokeWidth="2"/>
    <circle cx="55" cy="28" r="12" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2"/>
    <path d="M25 22L30 28L38 18" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M40 40 Q40 55 25 58" stroke="#10B981" strokeWidth="2" strokeDasharray="3 2"/>
    <path d="M40 40 Q40 55 55 58" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 2"/>
    <rect x="16" y="54" width="18" height="12" rx="6" fill="#10B981" opacity="0.4"/>
    <rect x="46" y="54" width="18" height="12" rx="6" fill="#EF4444" opacity="0.4"/>
  </svg>
);

const FlexIllustration = () => (
  <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 10 L45 25 L62 25 L48 35 L53 52 L40 42 L27 52 L32 35 L18 25 L35 25 Z" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5"/>
    <circle cx="40" cy="65" r="6" fill="#F59E0B" opacity="0.4"/>
    <line x1="40" y1="52" x2="40" y2="59" stroke="#F59E0B" strokeWidth="2"/>
  </svg>
);

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const [stats, setStats] = useState<Stats>({ communities: 0, followers: 0, following: 0, flex: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [activeActivityTab, setActiveActivityTab] = useState<'posts' | 'replies'>('posts');
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [userReplies, setUserReplies] = useState<UserReply[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchActivity();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;
    setLoadingStats(true);
    try {
      const supabase = createClient();

      const [commRes] = await Promise.all([
        supabase
          .from('community_members')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
      ]);

      setStats({
        communities: commRes.count ?? 0,
        followers: 0,  // extend with follows table when ready
        following: 0,
        flex: 0,
      });
    } catch (err) {
      console.warn('Error fetching profile stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchActivity = async () => {
    if (!user) return;
    setLoadingActivity(true);
    try {
      const supabase = createClient();

      const [postsRes, repliesRes] = await Promise.all([
        supabase
          .from('posts')
          .select('id, content, created_at, likes_count, replies_count')
          .eq('author_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('replies')
          .select('id, content, created_at, post_id')
          .eq('author_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      setUserPosts((postsRes.data as UserPost[]) || []);
      setUserReplies((userReplies as UserReply[]) || (repliesRes.data as UserReply[]) || []);
    } catch (err) {
      console.warn('Error fetching activity:', err);
    } finally {
      setLoadingActivity(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const handle = profile?.username || user?.email?.split('@')[0] || 'user';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || null;
  const initial = displayName.charAt(0).toUpperCase();

  const statCards = [
    { label: 'COMMUNITIES', value: stats.communities, illustration: <CommunityIllustration /> },
    { label: 'FOLLOWERS', value: stats.followers, illustration: <FollowerIllustration /> },
    { label: 'FOLLOWING', value: stats.following, illustration: <FollowingIllustration /> },
    { label: 'FLEX', value: stats.flex, illustration: <FlexIllustration /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* ─── Banner ────────────────────────────────────── */}
      <div
        style={{
          height: '160px',
          borderRadius: '20px 20px 0 0',
          background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 40%, #f9a8d4 65%, #c4b5fd 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Noise texture overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
          opacity: 0.6,
        }} />

        {/* COHORT USER badge */}
        <div
          style={{
            position: 'absolute', top: '14px', right: '16px',
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.92)',
            borderRadius: '9999px',
            padding: '6px 14px 6px 10px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span style={{ fontSize: '15px' }}>🌐</span>
          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a', letterSpacing: '0.3px' }}>
            COHORT USER
          </span>
          <div
            style={{
              width: '18px', height: '18px', borderRadius: '50%',
              backgroundColor: '#2563eb',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ color: '#ffffff', fontSize: '10px', fontWeight: 700 }}>✓</span>
          </div>
        </div>
      </div>

      {/* ─── Profile Header ───────────────────────────── */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '0 24px 24px',
          borderLeft: '1px solid rgba(0,0,0,0.06)',
          borderRight: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginTop: '-36px', marginBottom: '16px' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                style={{
                  width: '90px', height: '90px',
                  borderRadius: '18px',
                  border: '4px solid #ffffff',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  objectFit: 'cover',
                  backgroundColor: '#3d2b1f',
                }}
              />
            ) : (
              <div
                style={{
                  width: '90px', height: '90px',
                  borderRadius: '18px',
                  border: '4px solid #ffffff',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  backgroundColor: '#3d2b1f',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '36px', fontWeight: 800, color: '#ffffff',
                }}
              >
                {initial}
              </div>
            )}
            {/* Camera icon */}
            <button
              style={{
                position: 'absolute', bottom: '4px', right: '4px',
                width: '24px', height: '24px', borderRadius: '50%',
                backgroundColor: '#2060E8',
                border: '2px solid #ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }}
            >
              <Camera size={11} style={{ color: '#ffffff' }} />
            </button>
          </div>

          {/* Name + handle */}
          <div style={{ flex: 1, paddingBottom: '4px' }}>
            <h1
              style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 3px', lineHeight: 1.2 }}
            >
              {displayName}
            </h1>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>@{handle}</p>
          </div>

          {/* Action icons + Sign Out */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '4px' }}>
            {[
              { icon: <Pencil size={15} />, title: 'Edit profile' },
              { icon: <BarChart2 size={15} />, title: 'Analytics' },
              { icon: <MessageSquare size={15} />, title: 'Messages' },
              { icon: <Mail size={15} />, title: 'Email' },
            ].map(({ icon, title }) => (
              <button
                key={title}
                title={title}
                style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  border: '1px solid rgba(0,0,0,0.09)',
                  backgroundColor: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#475569',
                  transition: 'background-color 0.15s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f8fafc'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ffffff'; }}
              >
                {icon}
              </button>
            ))}

            <button
              onClick={handleSignOut}
              disabled={signingOut}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#FFF0EE',
                color: '#e11d48',
                fontSize: '13px', fontWeight: 700,
                cursor: signingOut ? 'wait' : 'pointer',
                transition: 'background-color 0.15s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFE0DC'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFF0EE'; }}
            >
              {signingOut
                ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                : <LogOut size={14} />
              }
              Sign out
            </button>
          </div>
        </div>

        {/* ─── Stats Row ───────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
          }}
        >
          {statCards.map(({ label, value, illustration }) => (
            <div
              key={label}
              style={{
                backgroundColor: '#fafbff',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '16px',
                padding: '20px 16px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              {illustration}
              {loadingStats ? (
                <div style={{ height: '28px', width: '40px', backgroundColor: '#e2e8f0', borderRadius: '8px' }} />
              ) : (
                <span style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</span>
              )}
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.8px' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Activity Section ─────────────────────────── */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderLeft: '1px solid rgba(0,0,0,0.06)',
          borderRight: '1px solid rgba(0,0,0,0.06)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          borderRadius: '0 0 20px 20px',
          padding: '24px',
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>
          Activity
        </h2>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {(['posts', 'replies'] as const).map((tab) => {
            const count = tab === 'posts' ? userPosts.length : userReplies.length;
            const isActive = activeActivityTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveActivityTab(tab)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  border: isActive ? 'none' : '1px solid rgba(0,0,0,0.09)',
                  backgroundColor: isActive ? '#0f172a' : '#ffffff',
                  color: isActive ? '#ffffff' : '#64748b',
                  fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: '20px', height: '20px', borderRadius: '9999px',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                    color: isActive ? '#ffffff' : '#64748b',
                    fontSize: '11px', fontWeight: 700, padding: '0 5px',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Activity Content */}
        {loadingActivity ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2].map((i) => (
              <div key={i} style={{ height: '72px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }} />
            ))}
          </div>
        ) : activeActivityTab === 'posts' ? (
          userPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
              <p style={{ fontSize: '14px', color: '#94a3b8' }}>No posts yet. Share something with your cohort!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    backgroundColor: '#fafbff',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                  }}
                >
                  <p style={{ fontSize: '13.5px', color: '#1e293b', margin: '0 0 8px', lineHeight: 1.55 }}>
                    {post.content.length > 180 ? post.content.slice(0, 180) + '…' : post.content}
                  </p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#94a3b8' }}>
                    <span>❤️ {post.likes_count}</span>
                    <span>💬 {post.replies_count}</span>
                    <span>{new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          userReplies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
              <p style={{ fontSize: '14px', color: '#94a3b8' }}>No replies yet. Join the conversation!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {userReplies.map((reply) => (
                <div
                  key={reply.id}
                  style={{
                    backgroundColor: '#fafbff',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                  }}
                >
                  <p style={{ fontSize: '13.5px', color: '#1e293b', margin: '0 0 8px', lineHeight: 1.55 }}>
                    {reply.content.length > 180 ? reply.content.slice(0, 180) + '…' : reply.content}
                  </p>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {new Date(reply.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
