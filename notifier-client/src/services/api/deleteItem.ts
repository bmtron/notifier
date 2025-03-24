import { API_ENDPOINT_URL_DEBUG, API_KEY } from '../../utils/constants/constants'
import { ErrorResponse } from '../../utils/helpers/ErrorResponse'
export interface DeleteItemResult<T> {
  success: boolean
  data?: T
  error?: string
}
export const deleteItem = async <TResponse>(
  itemId: number,
  endpoint: string
): Promise<DeleteItemResult<TResponse>> => {
  const fullEndpoint = API_ENDPOINT_URL_DEBUG + endpoint + '/' + itemId.toString()
  const token = localStorage.getItem('token')

  if (!token) {
    return {
      success: false,
      error: 'No token found',
    }
  }

  try {
    const response = await fetch(fullEndpoint, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
    })

    if (!response.ok) {
      return {
        success: false,
        error: 'Failed to delete item',
      }
    }

    const data = (await response.json()) as TResponse | ErrorResponse

    console.log('data', data)
    return {
      success: true,
      data: data as TResponse,
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to delete item',
    }
  }
}
