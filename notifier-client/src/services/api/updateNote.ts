import { Note, UpdateNoteResult } from '../../utils/models/Note'

import { updateItem } from './updateItem'

export const updateNote = async (note: Note): Promise<UpdateNoteResult> => {
  if (note.noteId === null) {
    return {
      success: false,
      error: 'Cannot update note: noteId is null',
    }
  }
  return updateItem<Note>(note, `/api/notes/${note.noteId.toString()}`)
}
