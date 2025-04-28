import { TodoSet } from '@/models/TodoSetsWithItems';
import { TodoState } from '../rootState';

const initialTodoState: TodoState = {
  newTodoSet: null,
  newTodoItem: null,
  activeTodoSets: [],
  archivedTodoSets: [],
  activeTodoItems: [],
  archivedTodoItems: [],
};

interface SetNewTodoSet {
  type: 'SET_NEW_TODO_SET_ACTION';
  payload: TodoSet;
}
export type TodosAction = SetNewTodoSet;

const TodosReducer = (todoState: TodoState = initialTodoState, action: TodosAction) => {
  switch (action.type) {
    case 'SET_NEW_TODO_SET_ACTION':
      return {
        ...todoState,
        newTodoSet: action.payload,
      };
    default:
      return todoState;
  }
};

export default TodosReducer;
