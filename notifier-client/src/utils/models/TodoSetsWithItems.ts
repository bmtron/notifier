import { TodoItem } from './TodoItem'

export interface TodoSet {
  TodoSetId: number | null
  UserId: number
  Title: string
  Deleted: boolean
  CreatedAt: string // ISO date string
  UpdatedAt: string | null // ISO date string or null
}

export interface CreateTodoSetResult {
  success: boolean
  data?: TodoSet
  error?: string
}

export interface TodoSetWithItems extends TodoSet {
  Items: TodoItem[]
}

export interface GetTodoItemsResult {
  success: boolean
  data?: TodoSetWithItems[]
  error?: string
}
