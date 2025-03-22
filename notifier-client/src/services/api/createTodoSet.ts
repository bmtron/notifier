import {
  CreateTodoSetResult,
  TodoSet,
  TodoSetApiResponse,
  transformTodoSetWithItemsFromApi,
} from '../../utils/models/TodoSetsWithItems'

import { createItem } from './createItem'

export const createTodoSet = async (todoSet: TodoSet): Promise<CreateTodoSetResult> => {
  const result = await createItem<TodoSet, TodoSetApiResponse>(todoSet, '/api/todo_sets')
  if (!result.success || !result.data) {
    return {
      success: false,
      error: 'Failed to create todo set',
    }
  } else {
    return {
      data: transformTodoSetWithItemsFromApi(result.data),
      success: true,
    }
  }
}
