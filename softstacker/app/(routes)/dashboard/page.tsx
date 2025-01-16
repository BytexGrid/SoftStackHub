'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import VoteButton from '@/components/VoteButton';

type Template = {
  id: string;
  title: string;
  description: string;
  category: string;
  target_os: string;
  votes: number;
  author_name?: string;
  author_avatar?: string;
  created_at: string;
};

type Analytics = {
  total_templates: number;
  total_votes_received: number;
  most_popular_template?: Template;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [userTemplates, setUserTemplates] = useState<Template[]>([]);
  const [votedTemplates, setVotedTemplates] = useState<Template[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    total_templates: 0,
    total_votes_received: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch data in parallel
        const [templatesRes, votedRes, analyticsRes] = await Promise.all([
          fetch('/api/templates/user'),
          fetch('/api/templates/voted'),
          fetch('/api/templates/analytics')
        ]);

        // Handle each response individually
        if (!templatesRes.ok) {
          console.error('Templates fetch failed:', await templatesRes.text());
        } else {
          const templatesData = await templatesRes.json();
          setUserTemplates(templatesData);
        }

        if (!votedRes.ok) {
          console.error('Voted templates fetch failed:', await votedRes.text());
        } else {
          const votedData = await votedRes.json();
          setVotedTemplates(votedData);
        }

        if (!analyticsRes.ok) {
          console.error('Analytics fetch failed:', await analyticsRes.text());
        } else {
          const analyticsData = await analyticsRes.json();
          setAnalytics(analyticsData);
        }

        // Only show error if all requests failed
        if (!templatesRes.ok && !votedRes.ok && !analyticsRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Please sign in to view your dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage your templates and activity
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Templates
            </h3>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {analytics.total_templates}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Votes Received
            </h3>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {analytics.total_votes_received}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Most Popular Template
            </h3>
            {analytics.most_popular_template ? (
              <Link 
                href={analytics.most_popular_template.target_os 
                  ? `/${analytics.most_popular_template.target_os.toLowerCase()}/${analytics.most_popular_template.id}`
                  : '#'}
                className="text-lg text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {analytics.most_popular_template.title}
              </Link>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No templates yet</p>
            )}
          </div>
        </div>

        {/* Your Templates */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Templates
            </h2>
            <Link
              href="/submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Create New Template
            </Link>
          </div>
          
          {userTemplates.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You haven&apos;t created any templates yet. Get started by creating your first template!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userTemplates.map(template => (
                <Link
                  key={template.id}
                  href={`/${template.target_os}/${template.id}`}
                  className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {template.title}
                    </h3>
                    <VoteButton 
                      templateId={template.id} 
                      initialVotes={template.votes}
                      showVoteButtons={false}
                    />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{template.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-300">
                      {template.target_os}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-300">
                      {template.category}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Voted Templates */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Templates You&apos;ve Voted On
          </h2>
          
          {votedTemplates.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <p className="text-gray-600 dark:text-gray-400">
                You haven&apos;t voted on any templates yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {votedTemplates.map(template => (
                <Link
                  key={template.id}
                  href={`/${template.target_os}/${template.id}`}
                  className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {template.title}
                    </h3>
                    <VoteButton 
                      templateId={template.id} 
                      initialVotes={template.votes}
                      showVoteButtons={false}
                    />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{template.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-300">
                      {template.target_os}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-300">
                      {template.category}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 