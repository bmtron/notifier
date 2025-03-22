import { CreateTodoSetResult, TodoSet } from '../../utils/models/TodoSetsWithItems'

import { createItem } from './createItem'

export const createTodoSet = async (todoSet: TodoSet): Promise<CreateTodoSetResult> => {
  return createItem<TodoSet>(todoSet, '/api/todo_sets')
}
