import { API_ENDPOINT_URL_DEBUG } from '../../utils/constants/constants'
import { ErrorResponse } from '../../utils/helpers/ErrorResponse'
import { User, UserResponse, CreateUserResult } from '../../utils/models/User'

export const createUser = async (user: User): Promise<CreateUserResult> => {
  const endpoint = API_ENDPOINT_URL_DEBUG + '/api/users'

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })

    const data = (await response.json()) as UserResponse | ErrorResponse

    if (!response.ok) {
      return {
        success: false,
        error: (data as ErrorResponse).message || 'Failed to create user',
      }
    }

    return {
      success: true,
      data: data as UserResponse,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}
