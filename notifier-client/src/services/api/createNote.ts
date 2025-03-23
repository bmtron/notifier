import {
  NoteApiResponse,
  Note,
  CreateNoteResult,
  transformNoteFromApi,
} from '../../utils/models/Note'

import { createItem } from './createItem'

export const createNote = async (note: Note): Promise<CreateNoteResult> => {
  const result = await createItem<NoteApiResponse>(note, '/api/notes')
  if (!result.success || !result.data) {
    return {
      success: false,
      error: 'Failed to create note',
    }
  } else {
    return {
      data: transformNoteFromApi(result.data),
      success: true,
    }
  }
}
