export interface TodoItem {
  TodoItemId: number | null
  TodoSetId: number
  Content: string
  Completed: boolean
  Deleted: boolean
  CreatedAt: Date | null
  UpdatedAt: Date | null
}

export interface CreateTodoItemResult {
  success: boolean
  data?: TodoItem
  error?: string
}
