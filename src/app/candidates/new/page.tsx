'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { taskService } from '@/services/task.service';
import { authService } from '@/services/auth.service';
import type { TaskStatus } from '@/types';
import { Card } from '@/components';

export default function NewCandidatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check authentication
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [router]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do' as TaskStatus,
    due_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert datetime-local format to ISO string for API
      const dueDateISO = formData.due_date ? new Date(formData.due_date).toISOString() : null;

      await taskService.create({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        due_date: dueDateISO,
      });

      router.push('/candidates');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/candidates"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium transition mb-4"
          >
            <span className="mr-2">←</span> Back to Candidates
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Add New Candidate
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill in the candidate information below to add them to your interview pipeline
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <span className="text-xl mr-3">⚠️</span>
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Candidate Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Candidate Name *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition"
                placeholder="e.g., John Doe"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Full name of the candidate
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description / Resume Summary
              </label>
              <textarea
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition"
                placeholder="Add candidate details, resume highlights, experience, skills, or initial notes..."
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Background information, skills, experience, or any relevant notes
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Initial Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition"
              >
                <option value="To Do">⏳ To Do - Awaiting Interview</option>
                <option value="In Progress">🔄 In Progress - Currently Interviewing</option>
                <option value="Done">✅ Done - Interview Completed</option>
              </select>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Current stage in the interview process
              </p>
            </div>

            {/* Interview Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                📅 Interview Date (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Schedule the interview date and time
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-400 disabled:to-purple-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-r-transparent mr-2"></div>
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="text-xl mr-2">+</span>
                    Create Candidate
                  </span>
                )}
              </button>
              <Link
                href="/candidates"
                className="px-6 py-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </Card>

        {/* Quick Tips */}
        <Card className="mt-6 p-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
          <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center">
            <span className="mr-2">💡</span>
            Quick Tips
          </h3>
          <ul className="space-y-2 text-sm text-indigo-800 dark:text-indigo-300">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Add detailed notes in the description to remember key points about the candidate</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Set the interview date to get reminders and keep track of your schedule</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>You can add interview notes and feedback after creating the candidate</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
