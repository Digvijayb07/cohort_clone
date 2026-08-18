'use client';

import React, { useState } from 'react';
import { Heart, MessageSquare, ExternalLink, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export interface Post {
  id: string;
  author_id?: string;
  author_name: string;
  author_handle: string;
  author_avatar?: string;
  content: string;
  link_url?: string;
  link_title?: string;
  link_domain?: string;
  likes_count: number;
  replies_count?: number;
  created_at: string;
  replies?: Reply[];
  user_has_liked?: boolean;
}

export interface Reply {
  id: string;
  author_name: string;
  author_handle: string;
  author_avatar?: string;
  content: string;
  created_at: string;
}

interface PostFeedProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

function formatPostDate(dateStr?: string): string {
  if (!dateStr) return '';
  if (dateStr === 'Just now' || dateStr.includes('May') || dateStr.includes('ago')) {
    return dateStr;
  }
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  } catch {
    return dateStr;
  }
}

export default function PostFeed({ posts, setPosts }: PostFeedProps) {
  const { user, profile } = useAuth();
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState<{ [postId: string]: string }>({});

  const toggleLike = async (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          const hasLiked = p.user_has_liked;
          return {
            ...p,
            user_has_liked: !hasLiked,
            likes_count: hasLiked ? Math.max(0, p.likes_count - 1) : p.likes_count + 1,
          };
        }
        return p;
      })
    );

    // Sync like with Supabase if logged in
    if (user) {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const post = posts.find((p) => p.id === postId);
        if (post?.user_has_liked) {
          await supabase.from('likes').delete().match({ post_id: postId, user_id: user.id });
        } else {
          await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
        }
      } catch (err) {
        console.warn('Supabase like sync error:', err);
      }
    }
  };

  const handleAddReply = async (postId: string) => {
    const text = replyInput[postId]?.trim();
    if (!text) return;

    const authorName = profile?.full_name || user?.email?.split('@')[0] || 'Anonymous';
    const authorHandle = profile?.username || user?.email?.split('@')[0] || 'user';
    const authorAvatar = profile?.avatar_url || '';

    const newReply: Reply = {
      id: typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(),
      author_name: authorName,
      author_handle: authorHandle,
      author_avatar: authorAvatar,
      content: text,
      created_at: 'Just now',
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updatedReplies = [...(p.replies || []), newReply];
          return {
            ...p,
            replies: updatedReplies,
            replies_count: updatedReplies.length,
          };
        }
        return p;
      })
    );

    setReplyInput((prev) => ({ ...prev, [postId]: '' }));

    // Sync reply with Supabase if available
    if (user) {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        await supabase.from('replies').insert({
          post_id: postId,
          author_id: user.id,
          author_name: authorName,
          author_handle: authorHandle,
          author_avatar: authorAvatar,
          content: text,
        });
      } catch (err) {
        console.warn('Supabase reply insert error:', err);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {posts.map((post) => (
        <article
          key={post.id}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: '20px',
            padding: '22px 24px',
            boxShadow: '0 2px 14px rgba(0,0,0,0.02)',
          }}
        >
          {/* Post Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {post.author_avatar ? (
                <img
                  src={post.author_avatar}
                  alt={post.author_name}
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
                    fontSize: '15px',
                  }}
                >
                  {post.author_name.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '14.5px', color: '#0f172a', margin: 0 }}>
                    {post.author_name}
                  </h3>
                  <span style={{ fontSize: '12.5px', color: '#94a3b8', marginLeft: '2px' }}>
                    @{post.author_handle}
                  </span>
                  <span style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                    · {formatPostDate(post.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Like Counter Badge */}
            <button
              onClick={() => toggleLike(post.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '9999px',
                border: `1px solid ${post.user_has_liked ? '#fecaca' : '#e2e8f0'}`,
                backgroundColor: post.user_has_liked ? '#fff1f2' : '#ffffff',
                color: post.user_has_liked ? '#e11d48' : '#64748b',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <Heart
                size={14}
                style={{
                  fill: post.user_has_liked ? '#e11d48' : 'none',
                  color: post.user_has_liked ? '#e11d48' : '#94a3b8',
                }}
              />
              <span>{post.likes_count}</span>
            </button>
          </div>

          {/* Post Content */}
          <div
            style={{
              marginTop: '12px',
              fontSize: '14px',
              color: '#334155',
              lineHeight: '1.65',
              whiteSpace: 'pre-line',
            }}
          >
            {post.content}
          </div>

          {/* Link Embed Preview Card */}
          {post.link_url && (
            <div style={{ marginTop: '14px' }}>
              <a
                href={post.link_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  backgroundColor: '#f0f7ff',
                  border: '1px solid #dbeafe',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'background-color 0.15s',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#dbeafe',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ExternalLink size={19} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#1d4ed8',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {post.link_title || post.link_url}
                  </p>
                  <p
                    style={{
                      fontSize: '11.5px',
                      color: '#94a3b8',
                      margin: '2px 0 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {post.link_domain || 'drive.google.com'}
                  </p>
                </div>
              </a>
            </div>
          )}

          {/* Post Footer Actions */}
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() =>
                setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)
              }
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#2563EB',
                backgroundColor: '#f0f6ff',
                border: '1px solid #dbeafe',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <MessageSquare size={14} />
              <span>
                {post.replies?.length || post.replies_count || 0}{' '}
                {(post.replies?.length || post.replies_count || 0) === 1 ? 'Reply' : 'Replies'}
              </span>
            </button>
          </div>

          {/* Nested Replies Section */}
          <div style={{ marginTop: '12px' }}>
            {post.replies && post.replies.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                {post.replies.map((reply) => (
                  <div
                    key={reply.id}
                    style={{
                      backgroundColor: '#f8fafc',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}
                  >
                    {reply.author_avatar ? (
                      <img
                        src={reply.author_avatar}
                        alt={reply.author_name}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#16a34a',
                          color: '#ffffff',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px',
                          flexShrink: 0,
                        }}
                      >
                        {reply.author_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                          {reply.author_name}
                        </span>
                        <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                          @{reply.author_handle}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#334155', margin: '4px 0 2px' }}>
                        {reply.content}
                      </p>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {formatPostDate(reply.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#4a403b',
                  color: '#ffffff',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  flexShrink: 0,
                }}
              >
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'M'}
              </div>

              <input
                type="text"
                value={replyInput[post.id] || ''}
                onChange={(e) =>
                  setReplyInput({ ...replyInput, [post.id]: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddReply(post.id);
                }}
                placeholder="Write a reply... Type @ to tag someone"
                style={{
                  flex: 1,
                  fontSize: '13px',
                  padding: '8px 14px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  color: '#1e293b',
                  outline: 'none',
                }}
              />

              <button
                onClick={() => handleAddReply(post.id)}
                disabled={!replyInput[post.id]?.trim()}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: replyInput[post.id]?.trim() ? '#84CEE4' : '#e2e8f0',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: replyInput[post.id]?.trim() ? 'pointer' : 'default',
                  transition: 'background-color 0.15s',
                  flexShrink: 0,
                }}
              >
                <Send size={13} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
