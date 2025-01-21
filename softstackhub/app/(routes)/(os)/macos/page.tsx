'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import VoteButton from '@/components/VoteButton';

type Template = {
  id: string;
  title: string;
  description: string;
  category: string;
  target_os: string;
  apps: {
    name: string;
    description: string;
    website: string;
    category: string;
    subcategory?: string;
    isRequired: boolean;
    brewPackage?: string;
  }[];
  votes: number;
  author_name?: string;
  author_avatar?: string;
};

export default function MacOSTemplates() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [templateVotes, setTemplateVotes] = useState<{[key: string]: number}>({});

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'developer', name: 'Developer' },
    { id: 'designer', name: 'Designer' },
    { id: 'productivity', name: 'Productivity' },
    { id: 'gaming', name: 'Gaming' }
  ];

  useEffect(() => {
    async function fetchTemplates() {
      try {
        setLoading(true);
        const response = await fetch(`/api/templates?os=macos${selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''}`);
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }
        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError(err instanceof Error ? err.message : 'Failed to load templates');
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 pt-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            macOS Software Templates
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Find the perfect software setup for your Mac
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8 space-x-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading templates...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Templates Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(template => (
              <Link
                key={template.id}
                href={`/macos/${template.id}`}
                className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {template.title}
                  </h3>
                  <div className="flex items-center">
                    <VoteButton 
                      templateId={template.id} 
                      initialVotes={template.votes}
                      showVoteButtons={false}
                      useStaticVotes={true}
                      onVoteChange={(newVotes: number) => {
                        setTemplateVotes(prev => ({
                          ...prev,
                          [template.id]: newVotes
                        }));
                      }}
                    />
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{template.description}</p>
                
                {/* Author Info */}
                {template.author_name && (
                  <div className="flex items-center gap-2 mb-4">
                    {template.author_avatar && (
                      <Image
                        src={template.author_avatar}
                        alt={template.author_name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Created by {template.author_name}
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Included Apps:</h4>
                  <div className="flex flex-wrap gap-2">
                    {template.apps.map(app => (
                      <span
                        key={app.name}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300"
                      >
                        {app.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Templates Found */}
        {!loading && !error && templates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No templates found for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
} 