import { TodoItem, UpdateTodoItemResult } from '../../utils/models/TodoItem'

import { updateItem } from './updateItem'

export const updateTodoItem = async (todoItem: TodoItem): Promise<UpdateTodoItemResult> => {
  if (todoItem.todoItemId === null) {
    return {
      success: false,
      error: 'Cannot update todo item: todoItemId is null',
    }
  }
  return updateItem<TodoItem>(todoItem, `/api/todo_items/${todoItem.todoItemId.toString()}`)
}
