import {
  TodoItem,
  TodoItemApiResponse,
  transformTodoItemFromApi,
} from '../../utils/models/TodoItem'

import { DeleteItemResult, deleteItem } from './deleteItem'

export const deleteTodoItem = async (itemId: number): Promise<DeleteItemResult<TodoItem>> => {
  const result = await deleteItem<TodoItemApiResponse>(itemId, '/api/todo_items')
  if (!result.success || !result.data) {
    return {
      success: false,
      error: 'Failed to delete todo item',
    }
  } else {
    return {
      data: transformTodoItemFromApi(result.data),
      success: true,
    }
  }
}
