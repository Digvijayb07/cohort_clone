import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cohort — A Social Platform for PCCOE',
  description:
    'Cohort is the official student social platform for Pimpri Chinchwad College of Engineering. Aggregate discussions, campus navigation, encrypted messaging and more.',
  keywords: 'PCCOE, Cohort, student platform, campus social, GDGC, ACM, OWASP',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
