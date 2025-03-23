export interface Note {
  noteId: number | null
  userId: number
  title: string
  content: string
  deleted: boolean
  dirty: boolean
  createdAt: Date | null
  updatedAt: Date | null
}

export interface CreateNoteResult {
  success: boolean
  data?: Note
  error?: string
}

export interface GetNotesResult {
  success: boolean
  data?: Note[]
  error?: string
}

export interface UpdateNoteResult {
  success: boolean
  data?: Note
  error?: string
}

export interface NoteApiResponse {
  note_id: number | null
  user_id: number
  title: string
  content: string
  deleted: boolean
  created_at: Date | null
  updated_at: Date | null
}

export const transformNoteFromApi = (data: NoteApiResponse): Note => ({
  noteId: data.note_id,
  userId: data.user_id,
  title: data.title,
  content: data.content,
  deleted: data.deleted,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
  dirty: false,
})
