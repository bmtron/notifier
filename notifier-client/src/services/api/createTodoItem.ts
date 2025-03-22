import { TodoItem, CreateTodoItemResult } from '../../utils/models/TodoItem'

import { createItem } from './createItem'

export const createTodoItem = async (todoItem: TodoItem): Promise<CreateTodoItemResult> => {
  return createItem<TodoItem>(todoItem, '/api/todo_items')
}
