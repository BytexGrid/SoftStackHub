'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface VoteButtonProps {
  templateId: string;
  initialVotes?: number;
  onVoteChange?: (newVoteCount: number) => void;
  showVoteButtons?: boolean;
  useStaticVotes?: boolean;
}

export default function VoteButton({ templateId, initialVotes = 0, onVoteChange, showVoteButtons = true, useStaticVotes = false }: VoteButtonProps) {
  const { user } = useAuth();
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isLoading, setIsLoading] = useState(!useStaticVotes);

  useEffect(() => {
    const checkUserVote = async () => {
      if (!user || useStaticVotes) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/templates/${templateId}/vote/check`);
        if (!response.ok) throw new Error('Failed to check vote');
        
        const data = await response.json();
        setUserVote(data.voteType);
        setVotes(data.votes);
        onVoteChange?.(data.votes);
      } catch (error) {
        console.error('Error checking vote:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserVote();
  }, [templateId, user, onVoteChange, useStaticVotes]);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user) {
      alert('Please sign in to vote');
      return;
    }

    try {
      const response = await fetch(`/api/templates/${templateId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType })
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert('Please sign in again to vote');
          return;
        }
        throw new Error('Failed to vote');
      }

      const data = await response.json();
      setVotes(data.votes);
      setUserVote(data.message === 'Vote removed' ? null : voteType);
      onVoteChange?.(data.votes);
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-8 w-20"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {showVoteButtons && (
        <button
          onClick={() => handleVote('up')}
          className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            userVote === 'up' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
          }`}
          title="Upvote"
        >
          <ArrowUpIcon className="h-5 w-5" />
        </button>
      )}
      
      <span className={`min-w-[2ch] text-center ${
        votes > 0 ? 'text-green-600 dark:text-green-400' :
        votes < 0 ? 'text-red-600 dark:text-red-400' :
        'text-gray-600 dark:text-gray-400'
      }`}>
        {votes}
      </span>

      {showVoteButtons && (
        <button
          onClick={() => handleVote('down')}
          className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            userVote === 'down' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
          }`}
          title="Downvote"
        >
          <ArrowDownIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
} 