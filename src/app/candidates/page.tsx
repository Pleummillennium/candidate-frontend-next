'use client';

import { useTasks } from '@/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { taskService } from '@/services/task.service';
import type { TaskStatus } from '@/types';

export default function CandidatesPage() {
  const router = useRouter();
  const { tasks: candidates, loading, error, refetch } = useTasks();
  const [filter, setFilter] = useState<'all' | TaskStatus>('all');

  const filteredCandidates = filter === 'all'
    ? candidates
    : candidates.filter(c => c.status === filter);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this candidate?')) return;

    try {
      await taskService.delete(id);
      refetch();
    } catch (err) {
      alert('Failed to delete candidate');
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await taskService.archive(id);
      refetch();
    } catch (err) {
      alert('Failed to archive candidate');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading candidates...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Candidates
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your interview candidates
            </p>
          </div>
          <Link
            href="/candidates/new"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow transition"
          >
            + Add Candidate
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All ({candidates.length})
          </button>
          <button
            onClick={() => setFilter('To Do')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'To Do'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            To Do ({candidates.filter(c => c.status === 'To Do').length})
          </button>
          <button
            onClick={() => setFilter('In Progress')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'In Progress'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            In Progress ({candidates.filter(c => c.status === 'In Progress').length})
          </button>
          <button
            onClick={() => setFilter('Done')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'Done'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Done ({candidates.filter(c => c.status === 'Done').length})
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Candidates Grid */}
        {filteredCandidates.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No candidates found. Add your first candidate!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {candidate.title}
                  </h3>
                  <StatusBadge status={candidate.status} />
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {candidate.description || 'No description'}
                </p>

                {candidate.due_date && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                    Interview: {new Date(candidate.due_date).toLocaleDateString()}
                  </p>
                )}

                <div className="flex gap-2">
                  <Link
                    href={`/candidates/${candidate.id}`}
                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-center rounded-lg transition"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleArchive(candidate.id)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition"
                  >
                    Archive
                  </button>
                  <button
                    onClick={() => handleDelete(candidate.id)}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const colors = {
    'To Do': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'Done': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {status}
    </span>
  );
}
