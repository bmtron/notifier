import { Note } from '@/models/Note';
import { Reminder } from '@/models/Reminder';
import { TodoItem } from '@/models/TodoItem';
import { TodoSet } from '@/models/TodoSetsWithItems';
import { configureStore } from '@reduxjs/toolkit';

export type NoteState = {
  newNote: Note | null;
  activeNotes: Note[];
  archivedNotes: Note[];
};

export type TodoState = {
  newTodoSet: TodoSet | null;
  newTodoItem: TodoItem | null;
  activeTodoSets: TodoSet[];
  archivedTodoSets: TodoSet[];
  activeTodoItems: TodoItem[];
  archivedTodoItems: TodoItem[];
};

export type ReminderState = {
  newReminder: Reminder | null;
  activeReminders: Reminder[];
  archivedReminders: Reminder[];
};

export type UserState = {
  userId: number;
  isAuthorized: boolean;
  authToken: string;
};

export type RootState = {
  notes: NoteState;
  user: UserState;
  todos: TodoState;
  reminders: ReminderState;
};

const rootState: RootState = {
  notes: {
    newNote: null,
    activeNotes: [],
    archivedNotes: [],
  },
  user: {
    userId: 0,
    isAuthorized: false,
    authToken: '',
  },
  todos: {
    newTodoSet: null,
    newTodoItem: null,
    activeTodoSets: [],
    archivedTodoSets: [],
    activeTodoItems: [],
    archivedTodoItems: [],
  },
  reminders: {
    newReminder: null,
    activeReminders: [],
    archivedReminders: [],
  },
};
export default rootState;
