import type { TaskStatus } from '@/types';

interface StatusBadgeProps {
  status: TaskStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    'To Do': {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-400',
      dot: 'bg-yellow-500',
      icon: '⏳',
    },
    'In Progress': {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-400',
      dot: 'bg-blue-500',
      icon: '🔄',
    },
    'Done': {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-400',
      dot: 'bg-green-500',
      icon: '✅',
    },
  };

  const { bg, text, dot, icon } = config[status];

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`}></span>
      <span className="text-xs">{icon}</span>
      <span>{status}</span>
    </span>
  );
}
