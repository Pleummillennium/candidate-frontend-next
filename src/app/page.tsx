export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          Task Management System
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
          Modern task management with real-time collaboration
        </p>
        <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
          <p>
            <span className="font-semibold">Frontend:</span> Next.js 16 + TypeScript + Tailwind CSS
          </p>
          <p>
            <span className="font-semibold">Backend:</span> Go + Gin + PostgreSQL + Clean Architecture
          </p>
          <p className="mt-4 text-xs">
            API Endpoint: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">http://localhost:8080</code>
          </p>
        </div>

        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300">Authentication</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">JWT-based secure login & registration</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-gray-700 rounded">
              <h3 className="font-semibold text-green-900 dark:text-green-300">Task Management</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Create, update, archive tasks with status</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-gray-700 rounded">
              <h3 className="font-semibold text-purple-900 dark:text-purple-300">Comments</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Real-time commenting on tasks</p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-gray-700 rounded">
              <h3 className="font-semibold text-orange-900 dark:text-orange-300">Change Logs</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Track all task modifications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
