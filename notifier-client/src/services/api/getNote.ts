import { API_ENDPOINT_URL_DEBUG, API_KEY } from '../../utils/constants/constants'
import { ErrorResponse } from '../../utils/helpers/ErrorResponse'
import { GetNotesResult, NoteApiResponse, transformNoteFromApi } from '../../utils/models/Note'

export const getNotes = async (userId: number): Promise<GetNotesResult> => {
  const endpoint = API_ENDPOINT_URL_DEBUG + '/api/notes/user/' + userId.toString()

  try {
    const token = localStorage.getItem('token')
    if (!token) {
      return {
        success: false,
        error: 'No token found',
      }
    }

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-API-Key': API_KEY,
      },
    })

    const data = (await response.json()) as NoteApiResponse[] | ErrorResponse

    if (!response.ok) {
      return {
        success: false,
        error: 'message' in data ? data.message : 'Failed to get notes',
      }
    }

    const transformedData = (data as NoteApiResponse[]).map(transformNoteFromApi)

    return {
      success: true,
      data: transformedData,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}
