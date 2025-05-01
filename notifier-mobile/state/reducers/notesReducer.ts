import { Note } from '@/models/Note';
import { NoteState } from '../rootState';

const initialNoteState: NoteState = {
  newNote: null,
  activeNotes: [],
  archivedNotes: [],
};

export enum NoteActions {
  SetNewNoteAction = 'SET_NEW_NOTE_ACTION',
  AddActiveNoteAction = 'ADD_ACTIVE_NOTE_ACTION',
  AddArchivedNoteAction = 'ADD_ARCHIVED_NOTE_ACTION',
  RemoveActiveNoteAction = 'REMOVE_ACTIVE_NOTE_ACTION',
  SetAllActiveNotesAction = 'SET_ALL_ACTIVE_NOTES_ACTION',
}
interface SetNewNoteAction {
  type: 'SET_NEW_NOTE_ACTION';
  payload: Note;
}

interface AddActiveNoteAction {
  type: 'ADD_ACTIVE_NOTE_ACTION';
  payload: Note;
}

interface AddArchivedNoteAction {
  type: 'ADD_ARCHIVED_NOTE_ACTION';
  payload: Note;
}

interface RemoveActiveNoteAction {
  type: 'REMOVE_ACTIVE_NOTE_ACTION';
  payload: number;
}

interface SetAllActiveNotesAction {
  type: 'SET_ALL_ACTIVE_NOTES_ACTION';
  payload: Note[];
}

export type NoteAction =
  | SetNewNoteAction
  | AddActiveNoteAction
  | AddArchivedNoteAction
  | RemoveActiveNoteAction
  | SetAllActiveNotesAction;

const notesReducer = (noteState: NoteState = initialNoteState, action: NoteAction) => {
  switch (action.type) {
    case NoteActions.SetNewNoteAction:
      return {
        ...noteState,
        newNote: action.payload,
      };
    case NoteActions.AddActiveNoteAction:
      return {
        ...noteState,
        activeNotes: [...noteState.activeNotes, action.payload],
      };
    case NoteActions.AddArchivedNoteAction:
      return {
        ...noteState,
        archivedNotes: [...noteState.archivedNotes, action.payload],
      };
    case NoteActions.RemoveActiveNoteAction:
      return {
        ...noteState,
        activeNotes: noteState.activeNotes.filter((n) => n.noteId !== action.payload),
      };
    case NoteActions.SetAllActiveNotesAction:
      return {
        ...noteState,
        activeNotes: action.payload,
      };
    default:
      return noteState;
  }
};

export default notesReducer;
