import { API_ENDPOINT_URL_DEBUG, API_KEY } from '../../utils/constants/constants';
import { ErrorResponse } from '../../utils/helpers/ErrorResponse';
import { Note } from '../../utils/models/Note';
import { TodoItem } from '../../utils/models/TodoItem';
import { TodoSet } from '../../utils/models/TodoSetsWithItems';

type AllowedItems = Note | TodoItem | TodoSet;

export interface UpdateItemResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const updateItem = async <TResponse>(
  item: AllowedItems,
  endpoint: string
): Promise<UpdateItemResult<TResponse>> => {
  const fullEndpoint = API_ENDPOINT_URL_DEBUG + endpoint;
  const token = localStorage.getItem('token');

  if (!token) {
    return {
      success: false,
      error: 'No token found',
    };
  }

  try {
    const response = await fetch(fullEndpoint, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(item),
    });

    const data = (await response.json()) as TResponse | ErrorResponse;

    if (!response.ok) {
      return {
        success: false,
        error: (data as ErrorResponse).message || `Failed to update item at ${endpoint}`,
      };
    }

    return {
      success: true,
      data: data as TResponse,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};
