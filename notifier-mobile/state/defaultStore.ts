import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import notesReducer, { NoteAction } from './reducers/notesReducer';
import { NoteState, TodoState, UserState } from './rootState';
import TodosReducer, { TodosAction } from './reducers/todosReducer';
import UserReducer, { UserAction } from './reducers/userReducer';

const rootReducer = combineReducers({
  notes: notesReducer as Reducer<NoteState, NoteAction>,
  todos: TodosReducer as Reducer<TodoState, TodosAction>,
  user: UserReducer as Reducer<UserState, UserAction>,
});
const store = configureStore({
  reducer: rootReducer,
});

export default store;

export type AppDispatch = typeof store.dispatch;
