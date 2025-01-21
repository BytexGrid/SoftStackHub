import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./providers/ThemeProvider";
import { AuthProvider } from './context/AuthContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SoftStackHub - Find Your Perfect Software Stack",
  description: "Discover and share curated software templates for your workflow. SoftStackHub helps developers find the best tools and applications for their projects.",
  keywords: "software stack, development tools, software templates, developer workflow, programming tools, tech stack, development environment",
  metadataBase: new URL('https://softstackhub.vercel.app'),
  verification: {
    google: 'jWuI40FvxcfzijaXf-ALNb4p8whNckdL49ZlWzdJYPM',
  },
  openGraph: {
    title: 'SoftStackHub - Find Your Perfect Software Stack',
    description: 'Discover and share curated software templates for your workflow',
    url: 'https://softstackhub.vercel.app',
    siteName: 'SoftStackHub',
    images: [
      {
        url: '/ssh.png',
        width: 512,
        height: 512,
        alt: 'SoftStackHub Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoftStackHub - Find Your Perfect Software Stack',
    description: 'Discover and share curated software templates for your workflow',
    images: ['/ssh.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/ssh.ico',
        sizes: '32x32',
      },
      {
        url: '/ssh.ico',
        sizes: '16x16',
      },
      {
        url: '/ssh.png',
        sizes: '192x192',
      },
      {
        url: '/ssh.png',
        sizes: '512x512',
      }
    ],
    shortcut: '/ssh.ico',
    apple: {
      url: '/ssh.png',
      sizes: '180x180',
      type: 'image/png',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-white dark:bg-gray-900`}>
        <ThemeProvider>
          <AuthProvider>
            <div className="pt-16">
              <Navbar />
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
