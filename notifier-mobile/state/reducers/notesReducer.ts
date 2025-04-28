import { Note } from '@/models/Note';
import { NoteState } from '../rootState';

const initialNoteState: NoteState = {
  newNote: null,
  activeNotes: [],
  archivedNotes: [],
};

interface SetNewNoteAction {
  type: 'SET_NEW_NOTE';
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

export type NoteAction =
  | SetNewNoteAction
  | AddActiveNoteAction
  | AddArchivedNoteAction
  | RemoveActiveNoteAction;

const notesReducer = (noteState: NoteState = initialNoteState, action: NoteAction) => {
  switch (action.type) {
    case 'SET_NEW_NOTE':
      return {
        ...noteState,
        newNote: action.payload,
      };
    case 'ADD_ACTIVE_NOTE_ACTION':
      return {
        ...noteState,
        activeNotes: [...noteState.activeNotes, action.payload],
      };
    case 'ADD_ARCHIVED_NOTE_ACTION':
      return {
        ...noteState,
        archivedNotes: [...noteState.archivedNotes, action.payload],
      };
    case 'REMOVE_ACTIVE_NOTE_ACTION':
      return {
        ...noteState,
        activeNotes: noteState.activeNotes.filter((n) => n.noteId !== action.payload),
      };
    default:
      return noteState;
  }
};

export default notesReducer;
