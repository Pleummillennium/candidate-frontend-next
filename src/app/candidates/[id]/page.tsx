'use client';

import { useState, useEffect } from 'react';
import { useTask, useComments } from '@/hooks';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { taskService } from '@/services/task.service';
import { commentService } from '@/services/comment.service';
import { authService } from '@/services/auth.service';
import type { TaskStatus } from '@/types';
import { Loading, Card, StatusBadge } from '@/components';

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = Number(params.id);

  const { task: candidate, loading: candidateLoading, error: candidateError, refetch: refetchCandidate } = useTask(candidateId);
  const { comments, loading: commentsLoading, refetch: refetchComments } = useComments(candidateId);

  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    status: 'To Do' as TaskStatus,
  });

  // Check authentication
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [router]);

  // Initialize edit data when candidate loads
  useEffect(() => {
    if (candidate && editData.title === '') {
      setEditData({
        title: candidate.title,
        description: candidate.description,
        status: candidate.status,
      });
    }
  }, [candidate]);

  const handleUpdate = async () => {
    try {
      await taskService.update(candidateId, editData);
      setIsEditing(false);
      refetchCandidate();
    } catch (err) {
      alert('Failed to update candidate');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentService.create(candidateId, { content: newComment });
      setNewComment('');
      refetchComments();
    } catch (err) {
      alert('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Delete this comment?')) return;

    try {
      await commentService.delete(commentId);
      refetchComments();
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  if (candidateLoading) {
    return <Loading text="Loading candidate details..." />;
  }

  if (candidateError || !candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="p-12 text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400">{candidateError || 'Candidate not found'}</p>
          <Link
            href="/candidates"
            className="inline-block mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
          >
            Back to Candidates
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/candidates"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium transition"
          >
            <span className="mr-2">←</span> Back to Candidates
          </Link>
        </div>

        {/* Candidate Info Card */}
        <Card className="p-8 mb-8">
          {!isEditing ? (
            <>
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {candidate.title}
                  </h1>
                  <StatusBadge status={candidate.status} />
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg font-medium inline-flex items-center"
                >
                  <span className="mr-2">✏️</span> Edit Candidate
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                    Description
                  </h3>
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {candidate.description || 'No description provided'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {candidate.due_date && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-2 uppercase tracking-wide">
                        📅 Interview Date
                      </h3>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {new Date(candidate.due_date).toLocaleString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2 uppercase tracking-wide">
                      👤 Created By
                    </h3>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {candidate.creator_name || `User #${candidate.creator_id}`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-medium">Created:</span> {new Date(candidate.created_at).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span> {new Date(candidate.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Edit Candidate</h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Candidate Name *
                </label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={5}
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value as TaskStatus })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="To Do">To Do - Awaiting Interview</option>
                  <option value="In Progress">In Progress - Interviewing</option>
                  <option value="Done">Done - Completed</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleUpdate}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all font-semibold shadow-lg"
                >
                  💾 Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Comments Section */}
        <Card className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="mr-3">💬</span>
            Interview Notes & Feedback
          </h2>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-8">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <textarea
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your interview notes, feedback, or observations..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-3 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all font-semibold shadow-lg"
              >
                📝 Add Comment
              </button>
            </div>
          </form>

          {/* Comments List */}
          {commentsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-indigo-600 border-r-transparent"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-5xl mb-3">📝</div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No comments yet. Be the first to add interview feedback!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-indigo-300 dark:hover:border-indigo-600 transition bg-white dark:bg-gray-800/50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white text-lg">
                        {comment.user_name || `User #${comment.user_id}`}
                      </span>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span className="mr-2">🕒</span>
                        {new Date(comment.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition text-sm font-medium"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
