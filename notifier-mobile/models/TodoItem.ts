export interface TodoItem {
  todoItemId: number | null;
  todoSetId: number;
  content: string;
  completed: boolean;
  deleted: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface CreateTodoItemResult {
  success: boolean;
  data?: TodoItem;
  error?: string;
}

export interface UpdateTodoItemResult {
  success: boolean;
  data?: TodoItem;
  error?: string;
}

export interface TodoItemApiResponse {
  todo_item_id: number | null;
  todo_set_id: number;
  content: string;
  completed: boolean;
  deleted: boolean;
  created_at: Date | null;
  updated_at: Date | null;
}

export const transformTodoItemFromApi = (data: TodoItemApiResponse): TodoItem => ({
  todoItemId: data.todo_item_id,
  todoSetId: data.todo_set_id,
  content: data.content,
  completed: data.completed,
  deleted: data.deleted,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});
