import { TodoSet, UpdateTodoSetBatchResult } from '../../utils/models/TodoSetsWithItems'

import { updateItemBatch } from './updateItemBatch'

export const updateTodoSetBatch = async (
  todoSetBatch: TodoSet[]
): Promise<UpdateTodoSetBatchResult> => {
  if (todoSetBatch.some((todoSet) => todoSet.todoSetId === null) || todoSetBatch.length === 0) {
    return {
      success: false,
      error: 'Cannot update todo sets: todoSets missing todoSetId or batch is empty',
    }
  }
  console.log('BATCH', todoSetBatch)
  return updateItemBatch<TodoSet>(todoSetBatch, '/api/todo_sets')
}
