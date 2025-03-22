import { TodoItem, transformTodoItemFromApi, TodoItemApiResponse } from './TodoItem'

export interface TodoSet {
  todoSetId: number | null
  userId: number
  title: string
  archived: boolean
  deleted: boolean
  createdAt: Date
  updatedAt: Date | null
}

export interface CreateTodoSetResult {
  success: boolean
  data?: TodoSet
  error?: string
}

export interface TodoSetWithItems extends TodoSet {
  items: TodoItem[] | undefined
}

export interface GetTodoItemsResult {
  success: boolean
  data?: TodoSetWithItems[]
  error?: string
}

export interface TodoSetApiResponse {
  todo_set_id: number | null
  user_id: number
  title: string
  archived: boolean
  deleted: boolean
  created_at: string | Date
  updated_at: string | Date | null
  items?: TodoItemApiResponse[]
}

export const transformTodoSetWithItemsFromApi = (data: TodoSetApiResponse): TodoSetWithItems => ({
  todoSetId: data.todo_set_id,
  userId: data.user_id,
  title: data.title,
  archived: data.archived,
  deleted: data.deleted,
  createdAt: new Date(data.created_at),
  updatedAt: data.updated_at ? new Date(data.updated_at) : null,
  items: data.items?.map(transformTodoItemFromApi),
})
