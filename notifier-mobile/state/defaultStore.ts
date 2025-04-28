import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import notesReducer, { NoteAction } from './reducers/notesReducer';
import { NoteState } from './rootState';

const rootReducer = combineReducers({
  notes: notesReducer as Reducer<NoteState, NoteAction>,
});
const store = configureStore({
  reducer: rootReducer,
});

export default store;

export type AddDispatch = typeof store.dispatch;
