'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import ThemeToggle from '@/app/components/ThemeToggle';
import { useRouter } from 'next/navigation';

type ThemePreference = 'system' | 'light' | 'dark';

export default function Settings() {
  const router = useRouter();
  const { user, signOut, signInWithGithub } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [themePreference, setThemePreference] = useState<ThemePreference>('system');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetch current theme preference
  useEffect(() => {
    async function fetchThemePreference() {
      if (!user) return;
      
      try {
        const response = await fetch('/api/user/preferences');
        if (!response.ok) throw new Error('Failed to fetch preferences');
        
        const data = await response.json();
        if (data.theme) {
          setThemePreference(data.theme as ThemePreference);
        }
      } catch (error) {
        console.error('Error fetching theme preference:', error);
      }
    }

    fetchThemePreference();
  }, [user]);

  const handleSavePreferences = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: themePreference })
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setSaveError('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSwitchAccount = async () => {
    await signOut();
    signInWithGithub();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Please sign in to view settings.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Settings
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage your account preferences
          </p>
        </div>

        {/* Profile Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile</h2>
          
          <div className="space-y-8">
            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Profile picture is managed through GitHub
                </p>
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <p className="text-gray-900 dark:text-white text-lg">
                {user.user_metadata.user_name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Username is managed through GitHub
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <p className="text-gray-900 dark:text-white text-lg">
                {user.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Email is managed through GitHub
              </p>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Appearance</h2>
          
          <div>
            {/* Theme Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Default Theme
              </label>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="theme-system"
                    name="theme-preference"
                    type="radio"
                    value="system"
                    checked={themePreference === 'system'}
                    onChange={(e) => setThemePreference(e.target.value as ThemePreference)}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor="theme-system" className="ml-3 block text-base text-gray-700 dark:text-gray-300">
                    System (Follow device settings)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="theme-light"
                    name="theme-preference"
                    type="radio"
                    value="light"
                    checked={themePreference === 'light'}
                    onChange={(e) => setThemePreference(e.target.value as ThemePreference)}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor="theme-light" className="ml-3 block text-base text-gray-700 dark:text-gray-300">
                    Light
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="theme-dark"
                    name="theme-preference"
                    type="radio"
                    value="dark"
                    checked={themePreference === 'dark'}
                    onChange={(e) => setThemePreference(e.target.value as ThemePreference)}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor="theme-dark" className="ml-3 block text-base text-gray-700 dark:text-gray-300">
                    Dark
                  </label>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Choose your preferred theme. This will be saved to your account.
              </p>
            </div>

            {/* Save Button */}
            <div className="mt-8">
              {saveError && (
                <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                  {saveError}
                </p>
              )}
              <button
                onClick={handleSavePreferences}
                disabled={isSaving}
                className={`bg-indigo-600 text-white hover:bg-indigo-500 px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  isSaving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>

        {/* Account Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account</h2>
          
          <div className="space-y-8">
            {/* Sign Out */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Sign Out
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Sign out of your account on this device
              </p>
              <button
                onClick={signOut}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 px-6 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>

            {/* Switch Account */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Switch Account
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Sign in with a different GitHub account
              </p>
              <button
                onClick={handleSwitchAccount}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 px-6 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Switch Account
              </button>
            </div>

            {/* Delete Account */}
            <div>
              <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
                Delete Account
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Permanently delete your account and all associated data
              </p>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Delete Account
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            {deleteError && (
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                {deleteError}
              </p>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsDeleting(true);
                  setDeleteError(null);
                  
                  try {
                    const response = await fetch('/api/user/delete', {
                      method: 'POST',
                    });

                    if (!response.ok) {
                      throw new Error('Failed to delete account');
                    }

                    // Sign out and redirect to home page
                    await signOut();
                    router.push('/');
                  } catch (error) {
                    console.error('Error deleting account:', error);
                    setDeleteError('Failed to delete account. Please try again.');
                    setIsDeleting(false);
                  }
                }}
                disabled={isDeleting}
                className={`bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 