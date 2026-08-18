'use client';

import React, { useState, useEffect } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface DbProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface DbCommunity {
  id: string;
  name: string;
  handle: string;
  members_count: number;
}

export default function RightSidebar() {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [dbUsers, setDbUsers] = useState<DbProfile[]>([]);
  const [dbCommunities, setDbCommunities] = useState<DbCommunity[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCommunities, setLoadingCommunities] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchCommunities();
  }, [currentUser]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const supabase = createClient();
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      if (!url || url.includes('your-supabase-project-id')) {
        setLoadingUsers(false);
        return;
      }

      let query = supabase
        .from('profiles')
        .select('id, full_name, username, email, avatar_url')
        .order('created_at', { ascending: false })
        .limit(10);

      if (currentUser?.id) {
        query = query.neq('id', currentUser.id);
      }

      const { data, error } = await query;

      if (data && !error) {
        setDbUsers(data);
      }
    } catch (err) {
      console.warn('Error fetching users from Supabase:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchCommunities = async () => {
    setLoadingCommunities(true);
    try {
      const supabase = createClient();
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      if (!url || url.includes('your-supabase-project-id')) {
        setLoadingCommunities(false);
        return;
      }

      const { data, error } = await supabase
        .from('communities')
        .select('id, name, handle, members_count')
        .order('members_count', { ascending: false })
        .limit(5);

      if (data && !error) {
        setDbCommunities(data);
      }
    } catch (err) {
      console.warn('Error fetching communities for sidebar:', err);
    } finally {
      setLoadingCommunities(false);
    }
  };

  const avatarColors = ['#7c3aed', '#059669', '#6366f1', '#d97706', '#0d9488', '#e11d48', '#2563eb', '#7c3aed', '#0891b2', '#65a30d'];

  return (
    <aside
      className="hidden xl:flex flex-col gap-6 py-6 px-10 sticky top-0 h-screen overflow-y-auto scrollbar-none"
      style={{
        width: '310px',
        backgroundColor: '#ffffff',
        borderLeft: '1px solid rgba(0,0,0,0.06)',
        scrollbarWidth: 'none',
      }}
    >
      {/* Top Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#eff1f5',
          borderRadius: '16px',
          padding: '10px 14px',
          border: '1px solid rgba(0,0,0,0.03)',
        }}
      >
        <Search size={17} style={{ color: '#64748b', flexShrink: 0 }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search cohort..."
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '13.5px',
            color: '#1e293b',
          }}
        />
        <kbd
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#64748b',
            backgroundColor: '#ffffff',
            padding: '2px 6px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          ⌘ K
        </kbd>
      </div>

      {/* Section 1: C/COMMUNITIES — live from Supabase */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            padding: '0 2px',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', letterSpacing: '0.5px' }}>
            C/COMMUNITIES
          </span>
          <button
            onClick={fetchCommunities}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {loadingCommunities ? (
            [1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 6px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#e2e8f0', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: '12px', width: '80%', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                </div>
              </div>
            ))
          ) : dbCommunities.length > 0 ? (
            dbCommunities.map((comm, idx) => {
              const colors = ['#eff6ff', '#ecfdf5', '#fef3c7', '#fdf2f8', '#f0fdfa'];
              const textColors = ['#2563eb', '#059669', '#d97706', '#9333ea', '#0d9488'];
              return (
                <div
                  key={comm.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '6px 8px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(0,0,0,0.03)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'; }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: colors[idx % colors.length],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '14px',
                      fontWeight: 700,
                      color: textColors[idx % textColors.length],
                    }}
                  >
                    {comm.name.charAt(0)}
                  </div>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0f172a',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {comm.name.length > 28 ? comm.name.slice(0, 28) + '...' : comm.name}
                  </span>
                </div>
              );
            })
          ) : (
            <p style={{ fontSize: '12.5px', color: '#94a3b8', padding: '4px 6px' }}>
              No communities yet
            </p>
          )}
        </div>
      </div>

      {/* Section 2: C/FRIENDS — live from Supabase */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            padding: '0 2px',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', letterSpacing: '0.5px' }}>
            C/FRIENDS
          </span>
          <button onClick={fetchUsers} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {loadingUsers ? (
            [1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e2e8f0', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: '12px', width: '70%', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '4px' }} />
                  <div style={{ height: '10px', width: '45%', backgroundColor: '#f1f5f9', borderRadius: '4px' }} />
                </div>
              </div>
            ))
          ) : dbUsers.length > 0 ? (
            dbUsers.map((friend, idx) => {
              const displayName = friend.full_name || friend.email?.split('@')[0] || 'User';
              const displayHandle = friend.username || friend.email?.split('@')[0] || 'user';
              const avatarLetter = displayName.charAt(0).toUpperCase();
              const avatarColor = avatarColors[idx % avatarColors.length];
              return (
                <div
                  key={friend.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(0,0,0,0.03)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'; }}
                >
                  {friend.avatar_url ? (
                    <img
                      src={friend.avatar_url}
                      alt={displayName}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: avatarColor,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {avatarLetter}
                    </div>
                  )}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {displayName}
                    </p>
                    <p style={{ fontSize: '11.5px', color: '#64748b', margin: '1px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      @{displayHandle}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ fontSize: '12.5px', color: '#94a3b8', padding: '4px 6px' }}>No users yet</p>
          )}
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.06)', margin: '4px 0' }} />

      {/* Section 3: C/CONNECT (Fetched dynamically from Supabase Database) */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            padding: '0 2px',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', letterSpacing: '0.5px' }}>
            C/CONNECT
          </span>
          <button
            onClick={fetchUsers}
            title="Refresh"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {loadingUsers ? (
            [1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '4px 6px' }}>
                <div style={{ height: '12px', width: '60%', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                <div style={{ height: '10px', width: '40%', backgroundColor: '#f1f5f9', borderRadius: '4px' }} />
              </div>
            ))
          ) : dbUsers.length > 0 ? (
            dbUsers.map((u, idx) => {
              const displayName = u.full_name || u.email?.split('@')[0] || 'User';
              const displayHandle = u.username || u.email?.split('@')[0] || 'user';
              const avatarColor = avatarColors[idx % avatarColors.length];
              return (
                <div
                  key={u.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(0,0,0,0.03)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'; }}
                >
                  {u.avatar_url ? (
                    <img
                      src={u.avatar_url}
                      alt={displayName}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: avatarColor,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {displayName}
                    </p>
                    <p style={{ fontSize: '11.5px', color: '#64748b', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      @{displayHandle}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ fontSize: '12.5px', color: '#94a3b8', padding: '4px 6px' }}>No users yet</p>
          )}
        </div>
      </div>
    </aside>
  );
}
