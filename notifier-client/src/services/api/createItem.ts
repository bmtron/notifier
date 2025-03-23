import { API_ENDPOINT_URL_DEBUG, API_KEY } from '../../utils/constants/constants'
import { ErrorResponse } from '../../utils/helpers/ErrorResponse'
import { Note, NoteApiResponse } from '../../utils/models/Note'
import { TodoItem, TodoItemApiResponse } from '../../utils/models/TodoItem'
import { TodoSet, TodoSetApiResponse } from '../../utils/models/TodoSetsWithItems'
import { User } from '../../utils/models/User'

type AllowedItems =
  | Note
  | TodoItem
  | TodoSet
  | TodoItemApiResponse
  | NoteApiResponse
  | User
  | TodoSetApiResponse

export interface CreateItemResult<T> {
  success: boolean
  data?: T
  error?: string
}

export const createItem = async <TResponse>(
  item: AllowedItems,
  endpoint: string
): Promise<CreateItemResult<TResponse>> => {
  const fullEndpoint = API_ENDPOINT_URL_DEBUG + endpoint
  const token = localStorage.getItem('token')

  if (!token) {
    return {
      success: false,
      error: 'No token found',
    }
  }

  try {
    const response = await fetch(fullEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(item),
    })

    const data = (await response.json()) as TResponse | ErrorResponse

    if (!response.ok) {
      return {
        success: false,
        error: (data as ErrorResponse).message || `Failed to create item at ${endpoint}`,
      }
    }

    return {
      success: true,
      data: data as TResponse,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}
