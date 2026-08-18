'use client';

import React, { useState } from 'react';
import { Paperclip, Send, Image as ImageIcon } from 'lucide-react';
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

    const newPostData = {
      id: typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(),
      author_id: user.id,
      author_name: authorName,
      author_handle: authorHandle,
      author_avatar: authorAvatar,
      content: content.trim(),
      link_url: linkUrl || null,
      link_title: linkTitle || null,
      link_domain: linkDomain || null,
      likes_count: 0,
      replies_count: 0,
      created_at: 'Just now',
    };

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
        .select()
        .single();

      if (!error && data) {
        if (onPostCreated) onPostCreated(data);
      } else {
        if (onPostCreated) onPostCreated(newPostData);
      }
    } catch (err) {
      console.warn('Supabase post insert fallback:', err);
      if (onPostCreated) onPostCreated(newPostData);
    } finally {
      setContent('');
      setLinkUrl('');
      setShowLinkInput(false);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setLinkUrl('');
    setShowLinkInput(false);
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid rgba(0,0,0,0.09)',
      borderRadius: '14px',
      padding: '16px 20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3.5">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#52443d] text-white font-semibold flex items-center justify-center text-lg shadow-inner">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'M'}
              </div>
            )}
          </div>

          {/* Text Area Input */}
          <div className="flex-1 min-w-0">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? Type @ to tag users or communities"
              rows={3}
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm resize-none pt-1"
            />

            {showLinkInput && (
              <div className="mt-2 mb-3">
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="Paste link URL (e.g. Google Drive link)..."
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowLinkInput(!showLinkInput)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ImageIcon size={16} className="text-slate-400" />
                  <span>Attach</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!content.trim() || isSubmitting}
                  className={`flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#93c5fd] hover:bg-[#3b82f6] rounded-full transition-all shadow-sm ${
                    !content.trim() || isSubmitting
                      ? 'opacity-60 cursor-not-allowed bg-blue-300'
                      : 'bg-blue-500 hover:bg-blue-600 active:scale-95 text-white'
                  }`}
                >
                  <Send size={13} />
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
