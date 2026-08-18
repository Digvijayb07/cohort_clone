'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, ExternalLink, Send, Share2, MoreHorizontal } from 'lucide-react';
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

export default function PostFeed({ posts, setPosts }: PostFeedProps) {
  const { user, profile, signInWithGoogle } = useAuth();
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {posts.map((post) => (
        <article
          key={post.id}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0,0,0,0.09)',
            borderRadius: '14px',
            padding: '16px 20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          {/* Post Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {post.author_avatar ? (
                <img
                  src={post.author_avatar}
                  alt={post.author_name}
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#2563EB', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                  {post.author_name.charAt(0)}
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ fontWeight: 600, fontSize: '13.5px', color: '#1e293b', margin: 0 }}>
                    {post.author_name}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>@{post.author_handle}</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>· {post.created_at}</span>
                </div>
              </div>
            </div>

            {/* Like Counter Badge */}
            <button
              onClick={() => toggleLike(post.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '5px 10px', borderRadius: '9999px',
                border: `1px solid ${post.user_has_liked ? '#fecaca' : '#e2e8f0'}`,
                backgroundColor: post.user_has_liked ? '#fff1f2' : '#f8fafc',
                color: post.user_has_liked ? '#e11d48' : '#64748b',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <Heart
                size={13}
                style={{ fill: post.user_has_liked ? '#e11d48' : 'none', color: post.user_has_liked ? '#e11d48' : '#94a3b8' }}
              />
              <span>{post.likes_count}</span>
            </button>
          </div>

          {/* Post Content */}
          <div style={{ marginTop: '10px', fontSize: '13.5px', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {post.content}
          </div>

          {/* Link Embed Preview Card */}
          {post.link_url && (
            <div style={{ marginTop: '10px' }}>
              <a
                href={post.link_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                  backgroundColor: '#eff6ff', border: '1px solid #dbeafe',
                  borderRadius: '10px', textDecoration: 'none',
                  transition: 'background-color 0.15s',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: '#dbeafe', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ExternalLink size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400 truncate">
                    {post.link_title || post.link_url}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {post.link_domain || 'external link'}
                  </p>
                </div>
              </a>
            </div>
          )}

          {/* Post Footer Actions */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() =>
                setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)
              }
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl transition-colors"
            >
              <MessageSquare size={14} />
              <span>
                {post.replies?.length || post.replies_count || 0}{' '}
                {(post.replies?.length || post.replies_count || 0) === 1 ? 'Reply' : 'Replies'}
              </span>
            </button>

            <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg">
              <Share2 size={15} />
            </button>
          </div>

          {/* Nested Replies Section */}
          <div className="mt-3 space-y-3">
            {post.replies && post.replies.length > 0 && (
              <div className="pl-4 border-l-2 border-slate-200 dark:border-slate-800 space-y-2.5 mt-3">
                {post.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl flex items-start gap-2.5"
                  >
                    {reply.author_avatar ? (
                      <img
                        src={reply.author_avatar}
                        alt={reply.author_name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {reply.author_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white">
                          {reply.author_name}
                        </span>
                        <span className="text-[11px] text-slate-400">@{reply.author_handle}</span>
                        <span className="text-[11px] text-slate-400">· {reply.created_at}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Drawer */}
            {activeReplyPostId === post.id && (
              <div className="flex items-center gap-2 mt-3 pt-2">
                <div className="w-7 h-7 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
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
                  className="flex-1 text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => handleAddReply(post.id)}
                  disabled={!replyInput[post.id]?.trim()}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 transition-colors"
                >
                  <Send size={13} />
                </button>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
