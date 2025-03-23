import {
  TodoItem,
  CreateTodoItemResult,
  TodoItemApiResponse,
  transformTodoItemFromApi,
} from '../../utils/models/TodoItem'

import { createItem } from './createItem'

export const createTodoItem = async (todoItem: TodoItem): Promise<CreateTodoItemResult> => {
  const result = await createItem<TodoItemApiResponse>(todoItem, '/api/todo_items')
  if (!result.success || !result.data) {
    return {
      success: false,
      error: 'Failed to create todo set',
    }
  } else {
    return {
      data: transformTodoItemFromApi(result.data),
      success: true,
    }
  }
}
