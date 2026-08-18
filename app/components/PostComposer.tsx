'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface PostComposerProps {
  onPostCreated?: (newPost: any) => void;
}

export default function PostComposer({ onPostCreated }: PostComposerProps) {
  const { user, profile, signInWithGoogle } = useAuth();
  const [content, setContent] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!user) {
      if (confirm('Please sign in with Google to publish posts. Would you like to sign in now?')) {
        signInWithGoogle();
      }
      return;
    }

    setIsSubmitting(true);

    const authorName = profile?.full_name || user.email?.split('@')[0] || 'User';
    const authorHandle = profile?.username || user.email?.split('@')[0] || 'user';
    const authorAvatar = profile?.avatar_url || '';

    let linkTitle = '';
    let linkDomain = '';
    if (linkUrl) {
      try {
        const parsed = new URL(linkUrl);
        linkDomain = parsed.hostname;
        linkTitle = linkUrl;
      } catch {
        linkDomain = 'web';
        linkTitle = linkUrl;
      }
    }

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            author_id: user.id,
            author_name: authorName,
            author_handle: authorHandle,
            author_avatar: authorAvatar,
            content: content.trim(),
            link_url: linkUrl || null,
            link_title: linkTitle || null,
            link_domain: linkDomain || null,
          },
        ])
        .select(`
          id, author_id, author_name, author_handle, author_avatar,
          content, link_url, link_title, link_domain,
          likes_count, replies_count, created_at,
          replies (
            id, author_name, author_handle, author_avatar, content, created_at
          )
        `)
        .single();

      if (error) {
        console.error('Supabase post creation error:', error);
        alert(`Failed to upload post to Supabase: ${error.message}\nMake sure your Supabase schema is executed in SQL Editor!`);
      } else if (data) {
        if (onPostCreated) onPostCreated(data);
        setContent('');
        setLinkUrl('');
        setShowLinkInput(false);
      }
    } catch (err: any) {
      console.error('Supabase post insert exception:', err);
      alert(`Could not connect to Supabase: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setLinkUrl('');
    setShowLinkInput(false);
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid rgba(0,0,0,0.06)',
        borderRadius: '20px',
        padding: '18px 24px',
        boxShadow: '0 2px 14px rgba(0,0,0,0.02)',
      }}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '14px' }}>
          {/* User Avatar */}
          <div style={{ flexShrink: 0 }}>
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || 'User'}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid #e2e8f0',
                }}
              />
            ) : (
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#4a403b',
                  color: '#ffffff',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}
              >
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'M'}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? Type @ to tag users or communities"
              rows={3}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                resize: 'none',
                fontSize: '14px',
                color: '#334155',
                lineHeight: '1.6',
                fontFamily: 'inherit',
                paddingTop: '6px',
              }}
            />

            {showLinkInput && (
              <div style={{ marginTop: '8px', marginBottom: '12px' }}>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="Paste link URL (e.g. Google Drive link)..."
                  style={{
                    width: '100%',
                    fontSize: '12px',
                    padding: '8px 12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    color: '#1e293b',
                    outline: 'none',
                  }}
                />
              </div>
            )}

            {/* Bottom Actions Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '14px',
                borderTop: '1px solid rgba(0,0,0,0.05)',
                marginTop: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowLinkInput(!showLinkInput)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#556477',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,0,0,0.04)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
                >
                  <ImageIcon size={16} strokeWidth={1.8} style={{ color: '#64748b' }} />
                  <span>Attach</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: '6px 12px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#64748b',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#1e293b'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#64748b'; }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!content.trim() || isSubmitting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 22px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    color: '#ffffff',
                    backgroundColor: !content.trim() || isSubmitting ? '#b8e3ef' : '#84CEE4',
                    border: 'none',
                    borderRadius: '9999px',
                    cursor: !content.trim() || isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: !content.trim() || isSubmitting ? 'none' : '0 2px 10px rgba(132, 206, 228, 0.35)',
                    transition: 'all 0.15s',
                  }}
                >
                  <Send size={13} strokeWidth={2.4} />
                  <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
