'use client';

import React, { useState, useEffect } from 'react';
import { Users, Bell, BellOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

interface Community {
  id: string;
  name: string;
  handle: string;
  description: string | null;
  banner_url: string | null;
  icon_url: string | null;
  members_count: number;
  user_is_member?: boolean;
}

// Gradient palette for communities without a banner
const BANNER_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
];

export default function CommunitiesPage() {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [supabaseReady, setSupabaseReady] = useState(true);

  useEffect(() => {
    fetchCommunities();
  }, [user]);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      if (!url || url.includes('your-supabase-project-id')) {
        setSupabaseReady(false);
        setLoading(false);
        return;
      }

      const supabase = createClient();

      const { data: commsData, error } = await supabase
        .from('communities')
        .select('*')
        .order('members_count', { ascending: false });

      if (error || !commsData) {
        console.error('Error fetching communities:', error?.message);
        setLoading(false);
        return;
      }

      // If logged in, check which ones the user has joined
      if (user) {
        const { data: memberData } = await supabase
          .from('community_members')
          .select('community_id')
          .eq('user_id', user.id);

        const joinedIds = new Set((memberData || []).map((m: any) => m.community_id));

        setCommunities(
          commsData.map((c: Community) => ({
            ...c,
            user_is_member: joinedIds.has(c.id),
          }))
        );
      } else {
        setCommunities(commsData);
      }
    } catch (err) {
      console.error('Error fetching communities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeave = async (community: Community) => {
    if (!user) {
      alert('Please sign in with Google to join communities.');
      return;
    }

    setJoiningId(community.id);
    const supabase = createClient();

    try {
      if (community.user_is_member) {
        // Leave
        const { error } = await supabase
          .from('community_members')
          .delete()
          .match({ community_id: community.id, user_id: user.id });

        if (!error) {
          setCommunities((prev) =>
            prev.map((c) =>
              c.id === community.id
                ? { ...c, user_is_member: false, members_count: Math.max(0, c.members_count - 1) }
                : c
            )
          );
        }
      } else {
        // Join
        const { error } = await supabase
          .from('community_members')
          .insert({ community_id: community.id, user_id: user.id });

        if (!error) {
          setCommunities((prev) =>
            prev.map((c) =>
              c.id === community.id
                ? { ...c, user_is_member: true, members_count: c.members_count + 1 }
                : c
            )
          );
        } else {
          console.error('Join error:', error.message);
        }
      }
    } catch (err) {
      console.error('Error joining/leaving community:', err);
    } finally {
      setJoiningId(null);
    }
  };

  if (!supabaseReady) {
    return (
      <div
        style={{
          backgroundColor: '#fefce8',
          border: '1px solid #fde68a',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontWeight: 700, color: '#92400e', marginBottom: '6px' }}>⚠️ Supabase not connected</p>
        <p style={{ fontSize: '13px', color: '#78350f' }}>
          Set your <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code>.env.local</code>, then run the schema.sql in Supabase.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px',
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ height: '140px', backgroundColor: '#e2e8f0', animation: 'pulse 1.5s infinite' }} />
            <div style={{ padding: '18px' }}>
              <div style={{ height: 14, width: '70%', backgroundColor: '#e2e8f0', borderRadius: 6, marginBottom: 8 }} />
              <div style={{ height: 11, width: '45%', backgroundColor: '#f1f5f9', borderRadius: 6, marginBottom: 12 }} />
              <div style={{ height: 11, width: '90%', backgroundColor: '#f1f5f9', borderRadius: 6, marginBottom: 6 }} />
              <div style={{ height: 11, width: '60%', backgroundColor: '#f1f5f9', borderRadius: 6 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (communities.length === 0) {
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '48px 24px',
          textAlign: 'center',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ fontSize: '42px', marginBottom: '12px' }}>🏘️</div>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>No communities yet</h3>
        <p style={{ fontSize: '13.5px', color: '#64748b' }}>
          Run the <code>supabase/schema.sql</code> in your Supabase SQL Editor to seed communities.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Communities</h2>
        <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
          Explore and join communities at PCCOE
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {communities.map((community, idx) => (
          <div
            key={community.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.03)';
            }}
          >
            {/* Banner */}
            <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
              {community.banner_url ? (
                <img
                  src={community.banner_url}
                  alt={community.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    // Fallback to gradient if image fails
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    (e.currentTarget.parentElement as HTMLDivElement).style.background = BANNER_GRADIENTS[idx % BANNER_GRADIENTS.length];
                  }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: BANNER_GRADIENTS[idx % BANNER_GRADIENTS.length] }} />
              )}

              {/* Bell (notify) button top-right */}
              <button
                title={community.user_is_member ? 'Notifications on' : 'Get notified'}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {community.user_is_member
                  ? <Bell size={15} style={{ color: '#2060E8' }} />
                  : <BellOff size={15} style={{ color: '#64748b' }} />
                }
              </button>

              {/* Community Icon Overlay */}
              {community.icon_url && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-16px',
                    left: '16px',
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    border: '2px solid #ffffff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={community.icon_url}
                    alt={community.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            {/* Card Body */}
            <div style={{ padding: community.icon_url ? '24px 18px 18px' : '16px 18px 18px' }}>
              <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', margin: '0 0 2px', lineHeight: 1.35 }}>
                {community.name}
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 8px' }}>
                @{community.handle}
              </p>
              {community.description && (
                <p
                  style={{
                    fontSize: '12.5px',
                    color: '#475569',
                    margin: '0 0 12px',
                    lineHeight: 1.55,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {community.description}
                </p>
              )}

              {/* Footer: members + join button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '12px' }}>
                  <Users size={13} />
                  <span>{community.members_count} member{community.members_count !== 1 ? 's' : ''}</span>
                </div>

                <button
                  onClick={() => handleJoinLeave(community)}
                  disabled={joiningId === community.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 16px',
                    borderRadius: '9999px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    border: community.user_is_member ? '1.5px solid #e2e8f0' : '1.5px solid #2060E8',
                    backgroundColor: community.user_is_member ? '#ffffff' : '#2060E8',
                    color: community.user_is_member ? '#475569' : '#ffffff',
                    cursor: joiningId === community.id ? 'wait' : 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: community.user_is_member ? 'none' : '0 2px 8px rgba(32, 96, 232, 0.25)',
                  }}
                >
                  {joiningId === community.id ? (
                    <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : community.user_is_member ? (
                    'Joined ✓'
                  ) : (
                    '+ Join'
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
