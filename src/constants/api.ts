// API related constants

export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',

  // Tasks
  TASKS: '/api/tasks',
  TASKS_ARCHIVED: '/api/tasks/archived',
  TASK_BY_ID: (id: number) => `/api/tasks/${id}`,
  TASK_ARCHIVE: (id: number) => `/api/tasks/${id}/archive`,
  TASK_UNARCHIVE: (id: number) => `/api/tasks/${id}/unarchive`,
  TASK_LOGS: (id: number) => `/api/tasks/${id}/logs`,

  // Comments
  TASK_COMMENTS: (taskId: number) => `/api/tasks/${taskId}/comments`,
  COMMENT_BY_ID: (id: number) => `/api/comments/${id}`,
} as const;

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

export const TASK_STATUS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
} as const;
