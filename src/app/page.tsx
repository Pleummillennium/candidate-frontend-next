import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center max-w-3xl px-6">
        <h1 className="text-6xl font-bold mb-6 text-gray-900 dark:text-white">
          Candidate Management
        </h1>
        <p className="text-2xl text-gray-600 dark:text-gray-300 mb-8">
          Track and manage your interview candidates efficiently
        </p>

        <div className="flex gap-4 justify-center mb-12">
          <Link
            href="/candidates"
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all"
          >
            View Candidates
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-4 bg-white hover:bg-gray-50 text-indigo-600 font-semibold rounded-lg shadow-lg border-2 border-indigo-600 transition-all"
          >
            Login
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Track Candidates</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage candidates through interview stages
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Interview Notes</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add comments and feedback for each candidate
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Status Tracking</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              To Do → In Progress → Done
            </p>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Next.js 16 + TypeScript + Go Backend</p>
        </div>
      </div>
    </div>
  );
}
