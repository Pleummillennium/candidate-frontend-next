// Task types matching backend API

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  creator_id: number;
  creator_name?: string;
  due_date?: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  due_date?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  due_date?: string | null;
}

export interface TaskListResponse {
  data: Task[];
  total: number;
  page: number;
  limit: number;
}

export interface TaskLog {
  id: number;
  task_id: number;
  user_id: number;
  user_name?: string;
  action: string;
  details?: string;
  field_name?: string;
  old_value?: string;
  new_value?: string;
  created_at: string;
}
