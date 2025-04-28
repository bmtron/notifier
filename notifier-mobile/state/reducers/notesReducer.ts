import { Note } from '@/models/Note';
import { NoteState } from '../rootState';
import { UnknownAction } from '@reduxjs/toolkit';

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

export type NoteAction = SetNewNoteAction | AddActiveNoteAction;

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
    default:
      return noteState;
  }
};

export default notesReducer;
