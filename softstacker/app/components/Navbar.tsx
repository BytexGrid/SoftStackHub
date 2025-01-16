'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, loading, signInWithGithub, signOut } = useAuth();

  const handleSwitchAccount = async () => {
    await signOut();
    signInWithGithub();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side: Logo and navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              SoftStacker
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link 
                href="/templates"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Browse Templates
              </Link>
              <a 
                href="https://github.com/BytexGrid/SoftStacker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Contribute
              </a>
            </div>
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center space-x-6">
            <Link
              href="/submit"
              className="hidden md:block bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-500 dark:hover:bg-green-400"
            >
              Submit Template
            </Link>
            <ThemeToggle />
            <a
              href="https://github.com/BytexGrid/SoftStacker"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            {loading ? (
              <div className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium opacity-50">
                Loading...
              </div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-sm focus:outline-none"
                >
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {user.user_metadata.user_name}
                  </span>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleSwitchAccount();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Switch Account
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        signOut();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={signInWithGithub}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-900">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/templates"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
            >
              Browse Templates
            </Link>
            <a
              href="https://github.com/BytexGrid/SoftStacker"
              target="_blank"
              rel="noopener noreferrer"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
            >
              Contribute
            </a>
            <div className="pl-3 pr-4 py-2">
              <Link href="/submit" className="block w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-500 dark:hover:bg-green-400 mb-2">
                Submit Template
              </Link>
              {loading ? (
                <div className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium opacity-50">
                  Loading...
                </div>
              ) : user ? (
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 px-4 py-2">
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {user.user_metadata.user_name}
                    </span>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSwitchAccount();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Switch Account
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={signInWithGithub}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 