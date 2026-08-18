'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { user, profile, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    if (!agreed) {
      alert('Please agree to the Terms and Conditions and Privacy Policy first.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Sign in error:', err);
      setErrorMsg(err.message || 'Failed to initialize Google authentication');
      setLoading(false);
    }
  };

  return (
    <div className="login-backdrop">
      {/* Spotlight glow effect */}
      <div className="login-spotlight" />

      {/* Back to home / close button */}
      <Link href="/" className="login-close-btn" aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </Link>

      {/* Centered Modal Card */}
      <div className="login-modal-card">
        {/* Left Side: Artwork Image */}
        <div className="login-card-left">
          <Image
            src="/login_image.jpg"
            alt="Cohort 3D Mannequin Artwork"
            fill
            priority
            className="login-artwork-img"
          />
        </div>

        {/* Right Side: Welcome & Sign In Form */}
        <div className="login-card-right">
          {/* Cohort Logo Icon */}
          <div className="login-logo-icon">
            <svg width="46" height="46" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" stroke="url(#loginCardGrad)" strokeWidth="2.5" fill="none" />
              <circle cx="12" cy="18" r="5" fill="#5B4FE8" />
              <circle cx="24" cy="18" r="5" fill="#E84FAA" />
              <circle cx="18" cy="12.5" r="5" fill="#4FAAE8" />
              <circle cx="18" cy="23.5" r="5" fill="#E8A44F" />
              <defs>
                <linearGradient id="loginCardGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#5B4FE8" />
                  <stop offset="1" stopColor="#E84FAA" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Heading */}
          <h1 className="login-title">WELCOME TO<br />COHORT</h1>

          {/* Subtitle */}
          <p className="login-subtitle">
            Connect, message, and innovate with your campus community
          </p>

          {/* Terms & Conditions Checkbox */}
          <label className="login-terms-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="login-checkbox"
            />
            <span className="login-terms-text">
              I agree to the{' '}
              <a href="#" className="login-terms-link">Terms and Conditions</a> and{' '}
              <a href="#" className="login-terms-link">Privacy Policy</a>
            </span>
          </label>

          {/* Google Sign In Button / Pill */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="login-google-pill"
            aria-label="Sign in with Google"
          >
            {user ? (
              <>
                {/* Active user session preview */}
                <div className="login-pill-avatar">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || 'User'}
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#94a3b8">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>

                <div className="login-pill-text-box">
                  <span className="login-pill-name">
                    {loading ? 'Connecting...' : `Sign in as ${profile?.full_name || user.email?.split('@')[0]}`}
                  </span>
                  <span className="login-pill-email">
                    {user.email}
                  </span>
                </div>

                <div className="login-pill-google-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
              </>
            ) : (
              <>
                {/* Standard Google Sign-In for all visitors/devices */}
                <div className="login-pill-google-icon" style={{ boxShadow: 'none' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>

                <div className="login-pill-text-box" style={{ alignItems: 'center', textAlign: 'center' }}>
                  <span className="login-pill-name" style={{ fontSize: '14px', fontWeight: 700 }}>
                    {loading ? 'Connecting Google Auth...' : 'Continue with Google'}
                  </span>
                </div>

                <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </>
            )}
          </button>

          {errorMsg && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '14px', textAlign: 'center' }}>
              {errorMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
