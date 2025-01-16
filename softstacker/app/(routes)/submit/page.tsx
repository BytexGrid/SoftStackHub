'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import PackageSuggestions from '@/app/components/PackageSuggestions';

type OS = 'windows' | 'macos' | 'linux';
type PackageInfo = {
  name: string;
  description: string;
  version?: string;
  downloads?: number;
  website?: string;
};

type App = {
  name: string;
  description: string;
  website: string;
  category: string;
  subcategory?: string;  // Optional subcategory field
  isRequired: boolean;
  // Package names for different package managers
  chocolateyPackage?: string;  // Windows
  brewPackage?: string;        // macOS
  aptPackage?: string;         // Linux (Debian/Ubuntu)
  dnfPackage?: string;         // Linux (Fedora)
  pacmanPackage?: string;      // Linux (Arch)
};

export default function SubmitTemplate() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [targetOS, setTargetOS] = useState<OS>('windows');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('developer');
  const [apps, setApps] = useState<App[]>([]);
  const [currentApp, setCurrentApp] = useState<App>({
    name: '',
    description: '',
    website: '',
    category: 'Development',
    isRequired: false
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      alert('Please sign in to submit a template');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const handleSaveAsDraft = () => {
    const draftData = {
      targetOS,
      title,
      description,
      category,
      apps,
      currentApp
    };

    // Create a blob and download link
    const blob = new Blob([JSON.stringify(draftData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `template-draft-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLoadDraft = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const draftData = JSON.parse(e.target?.result as string);
        setTargetOS(draftData.targetOS);
        setTitle(draftData.title);
        setDescription(draftData.description);
        setCategory(draftData.category);
        setApps(draftData.apps);
        setCurrentApp(draftData.currentApp);
      } catch (error) {
        console.error('Error loading draft:', error);
        alert('Failed to load draft file. Please make sure it\'s a valid template draft.');
      }
    };
    reader.readAsText(file);
  };

  const handleAddApp = () => {
    if (currentApp.name && currentApp.description && currentApp.website) {
      setApps([...apps, currentApp]);
      setCurrentApp({
        name: '',
        description: '',
        website: '',
        category: 'Development',
        isRequired: false
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that we have at least one app
    if (apps.length === 0) {
      alert('Please add at least one application to the template');
      return;
    }

    try {
      console.log('Submitting template with apps:', { title, description, category, targetOS, apps });
      
      const response = await fetch('./api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          category,
          targetOS,
          apps
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit template');
      }

      const data = await response.json();
      console.log('Template created:', data);
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('developer');
      setApps([]);
      
      // Show success message
      alert('Template submitted successfully!');
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit template. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="mb-8 flex justify-between items-center">
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".json"
              onChange={handleLoadDraft}
              className="hidden"
              id="draft-file-input"
            />
            <label
              htmlFor="draft-file-input"
              className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Load Draft
            </label>
            <button
              type="button"
              onClick={handleSaveAsDraft}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save as Draft
            </button>
          </div>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Submit a Template
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Share your software stack with the community. Make sure to include detailed descriptions and accurate package names.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Operating System
                </label>
                <div className="flex gap-4">
                  {(['windows', 'macos', 'linux'] as OS[]).map(os => (
                    <button
                      key={os}
                      type="button"
                      onClick={() => setTargetOS(os)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                        ${targetOS === os
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                        }`}
                    >
                      {os.charAt(0).toUpperCase() + os.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Template Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  placeholder="e.g., Web Developer Essential"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  placeholder="Describe your template and its purpose..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                >
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="productivity">Productivity</option>
                  <option value="gaming">Gaming</option>
                </select>
              </div>
            </div>
          </div>

          {/* Apps */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Applications</h2>
            
            {/* Added Apps */}
            {apps.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Added Applications</h3>
                <div className="space-y-3">
                  {apps.map((app, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{app.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{app.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setApps(apps.filter((_, i) => i !== index))}
                        className="text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New App */}
            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="appName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Application Name
                </label>
                <input
                  type="text"
                  id="appName"
                  value={currentApp.name}
                  onChange={(e) => setCurrentApp({ ...currentApp, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  placeholder="e.g., VS Code"
                />
                <PackageSuggestions
                  searchTerm={currentApp.name}
                  targetOS={targetOS}
                  onSelect={(pkg: PackageInfo) => {
                    setCurrentApp({
                      ...currentApp,
                      name: pkg.name,
                      description: pkg.description || currentApp.description,
                      website: pkg.website || currentApp.website,
                      // Set package names based on OS
                      ...(targetOS === 'windows' && { chocolateyPackage: pkg.name }),
                      ...(targetOS === 'macos' && { brewPackage: pkg.name }),
                      ...(targetOS === 'linux' && {
                        aptPackage: pkg.name,
                        dnfPackage: pkg.name,
                        pacmanPackage: pkg.name
                      })
                    });
                    // Clear the input field after selection
                    const input = document.getElementById('appName') as HTMLInputElement;
                    if (input) {
                      input.value = pkg.name;
                      input.blur(); // Remove focus from input
                    }
                  }}
                />
              </div>

              <div>
                <label htmlFor="appDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Application Description
                </label>
                <input
                  type="text"
                  id="appDescription"
                  value={currentApp.description}
                  onChange={(e) => setCurrentApp({ ...currentApp, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  placeholder="Brief description of the application"
                />
              </div>

              <div>
                <label htmlFor="appWebsite" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  id="appWebsite"
                  value={currentApp.website}
                  onChange={(e) => setCurrentApp({ ...currentApp, website: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  placeholder="https://..."
                />
              </div>

              {targetOS === 'windows' && (
                <div>
                  <label htmlFor="chocolateyPackage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Chocolatey Package Name
                  </label>
                  <input
                    type="text"
                    id="chocolateyPackage"
                    value={currentApp.chocolateyPackage || ''}
                    onChange={(e) => setCurrentApp({ ...currentApp, chocolateyPackage: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    placeholder="Package name in Chocolatey"
                  />
                </div>
              )}

              {targetOS === 'macos' && (
                <div>
                  <label htmlFor="brewPackage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Homebrew Package Name
                  </label>
                  <input
                    type="text"
                    id="brewPackage"
                    value={currentApp.brewPackage || ''}
                    onChange={(e) => setCurrentApp({ ...currentApp, brewPackage: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    placeholder="Package name in Homebrew"
                  />
                </div>
              )}

              {targetOS === 'linux' && (
                <>
                  <div>
                    <label htmlFor="aptPackage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      APT Package Name (Debian/Ubuntu)
                    </label>
                    <input
                      type="text"
                      id="aptPackage"
                      value={currentApp.aptPackage || ''}
                      onChange={(e) => setCurrentApp({ ...currentApp, aptPackage: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      placeholder="Package name in APT"
                    />
                  </div>
                  <div>
                    <label htmlFor="dnfPackage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      DNF Package Name (Fedora)
                    </label>
                    <input
                      type="text"
                      id="dnfPackage"
                      value={currentApp.dnfPackage || ''}
                      onChange={(e) => setCurrentApp({ ...currentApp, dnfPackage: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      placeholder="Package name in DNF"
                    />
                  </div>
                  <div>
                    <label htmlFor="pacmanPackage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Pacman Package Name (Arch)
                    </label>
                    <input
                      type="text"
                      id="pacmanPackage"
                      value={currentApp.pacmanPackage || ''}
                      onChange={(e) => setCurrentApp({ ...currentApp, pacmanPackage: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      placeholder="Package name in Pacman"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRequired"
                  checked={currentApp.isRequired}
                  onChange={(e) => setCurrentApp({ ...currentApp, isRequired: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800"
                />
                <label htmlFor="isRequired" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Required Application
                </label>
              </div>

              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subcategory (Optional)
                </label>
                <input
                  type="text"
                  id="subcategory"
                  value={currentApp.subcategory || ''}
                  onChange={(e) => setCurrentApp({ ...currentApp, subcategory: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  placeholder="e.g., IDE, Database, Version Control"
                />
              </div>

              <button
                type="button"
                onClick={handleAddApp}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Add Application
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Submit Template
          </button>
        </form>
      </div>
    </div>
  );
} 