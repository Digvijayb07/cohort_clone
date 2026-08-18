'use client';

import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, BookOpen, Code, GraduationCap } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface DbProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
}

export default function RightSidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dbUsers, setDbUsers] = useState<DbProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const supabase = createClient();
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      if (!url || url.includes('your-supabase-project-id')) {
        setLoadingUsers(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, email, avatar_url')
        .order('created_at', { ascending: false })
        .limit(10);

      if (data && !error && data.length > 0) {
        setDbUsers(data);
      }
    } catch (err) {
      console.warn('Error fetching users for C/CONNECT from Supabase:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const communities = [
    {
      id: '1',
      name: 'Higher Studies Club for UPSC / MPSC -...',
      iconBg: '#eff6ff',
      icon: <GraduationCap size={17} className="text-blue-600" />,
    },
    {
      id: '2',
      name: 'Google Developer Groups PCCoE',
      iconBg: '#ecfdf5',
      icon: <Code size={17} className="text-emerald-600" />,
    },
    {
      id: '3',
      name: 'Higher Studies Club for CAT / GMAT -...',
      iconBg: '#fef3c7',
      icon: <BookOpen size={17} className="text-amber-600" />,
    },
  ];

  const friends = [
    {
      id: '1',
      name: 'C157_ Shravan Kolhe',
      handle: 'shravan24',
      avatarBg: '#7c3aed',
      avatarText: 'C',
      highlighted: true,
    },
    {
      id: '2',
      name: 'FELINA MATHEW',
      handle: 'felina22',
      avatarBg: '#059669',
      avatarText: '😊',
    },
    {
      id: '3',
      name: 'Arnav Telangi',
      handle: 'arnav24',
      avatarBg: '#6366f1',
      avatarText: '😊',
    },
  ];

  // Default fallback if database has no registered users yet
  const fallbackConnectUsers = [
    {
      id: '1',
      name: 'C157_ Shravan Kolhe',
      handle: 'shravan24',
    },
    {
      id: '2',
      name: 'FELINA MATHEW',
      handle: 'felina22',
    },
    {
      id: '3',
      name: 'Arnav Telangi',
      handle: 'arnav24',
    },
  ];

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

      {/* Section 1: C/COMMUNITIES */}
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
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {communities.map((comm) => (
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
                  backgroundColor: comm.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {comm.icon}
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
                {comm.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: C/FRIENDS */}
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
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {friends.map((friend) => (
            <div
              key={friend.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 12px',
                borderRadius: '14px',
                backgroundColor: friend.highlighted ? '#f1f3f7' : 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!friend.highlighted) (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(0,0,0,0.03)';
              }}
              onMouseLeave={(e) => {
                if (!friend.highlighted) (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: friend.avatarBg,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {friend.avatarText}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0f172a',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {friend.name}
                </p>
                <p
                  style={{
                    fontSize: '11.5px',
                    color: '#64748b',
                    margin: '1px 0 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  @{friend.handle}
                </p>
              </div>
            </div>
          ))}
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
          {loadingUsers && dbUsers.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '4px 6px' }}>
                  <div style={{ height: '12px', width: '60%', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ height: '10px', width: '40%', backgroundColor: '#f1f5f9', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          ) : dbUsers.length > 0 ? (
            dbUsers.map((u) => {
              const displayName = u.full_name || u.email?.split('@')[0] || 'User';
              const displayHandle = u.username || u.email?.split('@')[0] || 'user';

              return (
                <div
                  key={u.id}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(0,0,0,0.03)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'; }}
                >
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#0f172a',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {displayName}
                  </p>
                  <p
                    style={{
                      fontSize: '11.5px',
                      color: '#64748b',
                      margin: '2px 0 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    @{displayHandle}
                  </p>
                </div>
              );
            })
          ) : (
            fallbackConnectUsers.map((fallback) => (
              <div
                key={fallback.id}
                style={{
                  padding: '6px 8px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(0,0,0,0.03)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'; }}
              >
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0f172a',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {fallback.name}
                </p>
                <p
                  style={{
                    fontSize: '11.5px',
                    color: '#64748b',
                    margin: '2px 0 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  @{fallback.handle}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
