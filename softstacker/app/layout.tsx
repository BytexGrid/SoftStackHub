import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./providers/ThemeProvider";
import { AuthProvider } from './context/AuthContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SoftStacker - Find Your Perfect Software Stack",
  description: "Discover and share curated software templates for your workflow",
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
