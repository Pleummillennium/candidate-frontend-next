'use client';

import { use, useState } from 'react';
import { useTask, useComments } from '@/hooks';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { taskService } from '@/services/task.service';
import { commentService } from '@/services/comment.service';
import type { TaskStatus } from '@/types';

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

  // Initialize edit data when candidate loads
  if (candidate && !isEditing && editData.title === '') {
    setEditData({
      title: candidate.title,
      description: candidate.description,
      status: candidate.status,
    });
  }

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (candidateError || !candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {candidateError || 'Candidate not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/candidates"
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium mb-4 inline-block"
          >
            ← Back to Candidates
          </Link>
        </div>

        {/* Candidate Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-8">
          {!isEditing ? (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {candidate.title}
                  </h1>
                  <StatusBadge status={candidate.status} />
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Description
                  </h3>
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {candidate.description || 'No description'}
                  </p>
                </div>

                {candidate.due_date && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Interview Date
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(candidate.due_date).toLocaleString()}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Created by
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {candidate.creator_name || `User #${candidate.creator_id}`}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value as TaskStatus })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleUpdate}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Interview Notes & Comments
          </h2>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-8">
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your interview notes or feedback..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-2 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
            >
              Add Comment
            </button>
          </form>

          {/* Comments List */}
          {commentsLoading ? (
            <div className="text-center text-gray-500">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No comments yet. Add the first one!
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {comment.user_name || `User #${comment.user_id}`}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
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
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}>
      {status}
    </span>
  );
}
