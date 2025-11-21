// Comment types matching backend API

export interface Comment {
  id: number;
  task_id: number;
  user_id: number;
  user_name?: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentInput {
  content: string;
}

export interface UpdateCommentInput {
  content: string;
}
