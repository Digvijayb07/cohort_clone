# 🎓 Cohort — PCCOE Student Social Platform

> **Connect, message, and innovate with your campus community.**  
> A dedicated student-first social ecosystem tailored for Pimpri Chinchwad College of Engineering (PCCOE).

---

## 🌟 Executive Summary for Judges & Evaluators

**Cohort** unifies campus life into a single, high-performance web experience. Instead of fragmenting discussions across multiple chat apps, noticeboards, and disconnected portals, Cohort aggregates discussions, student clubs, campus navigation, and encrypted peer collaboration.

### 🔗 Quick Links
- **Live Application**: [Cohort on Vercel](https://cohort-pccoe.vercel.app) *(or your deployed URL)*
- **Dashboard Route**: `/dashboard` *(Direct access to full 3-column student platform)*
- **Authentication Route**: `/login` *(Google OAuth modal with Supabase)*
- **Landing Page**: `/` *(Hero WebGL fluid dynamics, curved marquee, features grid & footer)*

---

## ✨ Implemented Features & Highlights

### 1. 🎨 Immersive & Interactive Landing Experience (`/`)
- **WebGL Liquid Fluid Dynamics (`LiquidEther.jsx`)**: Real-time GPU-accelerated Navier-Stokes fluid simulation in the hero section responding dynamically to mouse pointer motion and inertia.
- **Curved Loop Text Marquee (`CurvedLoop.jsx`)**: Mathematically computed Bezier SVG path text looping with responsive velocity and drag-to-scrub interaction.
- **Fixed Spider-Man Campus Doodles (`FloatingSpiderman.tsx`)**: Ambient floating vector sketches pinned across viewport gutters with staggered organic keyframe floating animations.
- **8-Card Interactive Platform Grid (`FeaturesSection.tsx`)**: 
  - Dynamic gradient title highlights on **Communities**, **XD (Exchange)**, and **Student Profile**.
  - 3-step micro-interactions on hover: background shift, title slide, and bouncing floating gradient icon badges.
- **Pixel-Matched Footer (`Footer.tsx`)**: Multi-column architecture with dark vertical divider lines, social links, regulatory disclaimer, and bold brand typography.

---

### 2. 🔐 Full-Stack Authentication & Supabase Auth (`/login`)
- **Google OAuth Integration**: Built with `@supabase/ssr` and `@supabase/supabase-js`.
- **Spotlight Ambient Login Modal**: Split card design with optical 3D mannequin artwork, interactive Terms agreement, and responsive Google Sign-In button.
- **Session Auto-Parser & Callback Route (`app/auth/callback/route.ts`)**: Automatically captures OAuth callback tokens and hash fragments (`#access_token=...`), establishes the session, and redirects straight to `/dashboard`.
- **Global Auth State (`context/AuthContext.tsx`)**: Synchronous session tracking, real-time profile fetching, and secure cross-route persistence.

---

### 3. 🚀 3-Column Student App Dashboard (`/dashboard`)

#### 🧭 Left Navigation Sidebar (`Sidebar.tsx`)
- **Smart Expandable Menu**: Smooth hover transition (`72px` ⇄ `230px`) showing labels, active indicators, and notification badges (*HeadsUp 99+*, *Communities 2*).
- **Dark / Light Theme Toggle**: Instant theme switching with `localStorage` persistence and tailwind dark class synchronization.
- **Direct User Account & Logout**: Quick-action logout buttons accessible both in collapsed state and inside the user card.

#### 📝 Middle Feed & Post Interaction System (`PostComposer.tsx` & `PostFeed.tsx`)
- **Post Composer**: Real-time rich text editor supporting `@` community tags and URL attachment previews.
- **❤️ Functional Post Likes**: Interactive upvoting system with live like counters stored and updated dynamically.
- **💬 Nested Comment & Reply Threads**: Expandable reply tray with comment counters and reply author handles.
- **🔗 Rich Attachment Previews**: Embedded domain cards for shared Google Drive, GitHub, or documentation links.
- **🕒 Relative Date Engine**: Calculates human-friendly timestamps (*"Just now"*, *"5m ago"*, *"2h ago"*).

#### 🏘️ Communities Hub (`CommunitiesPage.tsx`)
- **Official Campus Chapters**: Discover GDGC, OWASP, ACM, Art Circle, and Higher Studies clubs.
- **Real-Time Join / Leave Engine**: Join official clubs with dynamic membership counters and notification bell subscription toggles.

#### 👤 Student Profile & Activity Hub (`ProfilePage.tsx`)
- **Profile Header**: Banner gradient, verified PCCOE student badge, Google avatar, and direct **Log Out** button.
- **Campus Stats Grid**: Tracks *Cohort Karma*, *Posts count*, *Joined Communities*, and *Upvotes received*.
- **User Activity Tabs**: Filterable view between personal published posts and user replies.

#### 🔍 Right Sidebar Social Hub (`RightSidebar.tsx`)
- **Cohort Search**: Instant filter across campus posts and discussions.
- **`C/COMMUNITIES`**: Quick-access shortcuts to trending clubs.
- **`C/FRIENDS`**: Campus peer circle with status avatars.
- **`C/CONNECT`**: Live student directory queried directly from Supabase `profiles` table.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) |
| **Language** | TypeScript (Strict mode) |
| **Styling & Design** | Tailwind CSS v4 + Vanilla CSS Design Tokens |
| **Graphics & 3D** | [Three.js](https://threejs.org/) + Custom GLSL Fragment/Vertex Shaders |
| **Backend / DB** | [Supabase](https://supabase.com/) (PostgreSQL, OAuth 2.0 PKCE, Row-Level Security) |
| **Icons** | [Lucide React](https://lucide.dev/) + Custom Scalable Vectors |

---

## 📂 Project Architecture

```
cohort/
├── app/
│   ├── auth/callback/route.ts   # Supabase OAuth token exchange callback
│   ├── components/
│   │   ├── AboutSection.tsx     # PCCOE institutional description
│   │   ├── CommunitiesPage.tsx  # Dynamic club cards with live join/leave
│   │   ├── CommunitiesSection.tsx # Logo marquee & curved loop container
│   │   ├── CurvedLoop.jsx       # SVG quadratic Bezier text loop animation
│   │   ├── FeaturesSection.tsx  # 8-feature cards with micro-animations
│   │   ├── FloatingSpiderman.tsx# Fixed doodle layer across viewport
│   │   ├── Footer.tsx           # Multi-column footer with dividers
│   │   ├── HeroSection.tsx      # Fluid dynamic hero & dashboard preview card
│   │   ├── LiquidEther.jsx      # WebGL Three.js fluid simulation shader
│   │   ├── Navbar.tsx           # Glassmorphism navbar with auth state
│   │   ├── PostComposer.tsx     # Rich post composer with link attachment
│   │   ├── PostFeed.tsx         # Post feed with likes & reply threads
│   │   ├── ProfilePage.tsx      # User profile, statistics & activity
│   │   ├── RightSidebar.tsx     # Search, club shortcuts & C/CONNECT
│   │   └── Sidebar.tsx          # Expandable sidebar with dark mode & logout
│   ├── dashboard/
│   │   └── page.tsx             # 3-column app dashboard controller
│   ├── login/
│   │   └── page.tsx             # Supabase Google OAuth login page
│   ├── globals.css              # Design tokens, typography & animations
│   ├── layout.tsx               # Root layout wrapped with AuthProvider
│   └── page.tsx                 # Landing page
├── context/
│   └── AuthContext.tsx          # Global Supabase authentication provider
├── lib/
│   └── supabase/
│       ├── client.ts            # Browser Supabase client (@supabase/ssr)
│       └── server.ts            # Server Supabase client with cookies
├── public/
│   ├── flaoting_svg/            # Spider-Man doodle vector assets
│   └── login_image.jpg          # Mannequin 3D artwork
└── supabase/
    └── schema.sql               # PostgreSQL tables & RLS security policies
```

---

## ⚡ Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/Digvijayb07/cohort_clone.git
cd cohort_clone
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Setup Supabase Database Schema
Copy and execute [`supabase/schema.sql`](supabase/schema.sql) in your **Supabase SQL Editor** to create the `profiles`, `posts`, `replies`, `likes`, and `communities` tables with pre-configured Row-Level Security (RLS) policies.

### 5. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏆 Evaluation Checklist for Judges

- [x] **Visual Design & Polish**: Custom WebGL shaders, fluid dynamics, curved typography, and responsive micro-animations.
- [x] **Working Supabase Authentication**: Google OAuth with automatic token handling and persistent sessions.
- [x] **Interactive Post System**: Functional post composer, live likes counter, nested replies, and link previews.
- [x] **Communities & Discovery**: PCCOE club hub with real-time membership toggles.
- [x] **User Profile Management**: Complete statistics overview (*Cohort Karma, Posts, Upvotes*) and quick sign-out.
- [x] **Dark / Light Theme**: Seamless toggle with local storage persistence.
- [x] **Responsive Layout**: Optimized across desktop, tablet, and mobile displays.

---

*Built with ❤️ for PCCOE by the Cohort Student Development Team.*
