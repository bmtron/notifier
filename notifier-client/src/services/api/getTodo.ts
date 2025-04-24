import { API_ENDPOINT_URL_DEBUG, API_KEY } from '../../utils/constants/constants';
import { ErrorResponse } from '../../utils/helpers/ErrorResponse';
import {
  GetTodoItemsResult,
  transformTodoSetWithItemsFromApi,
  TodoSetApiResponse,
} from '../../utils/models/TodoSetsWithItems';

export const getTodoItems = async (userId: number): Promise<GetTodoItemsResult> => {
  const endpoint = API_ENDPOINT_URL_DEBUG + '/api/todo_sets/user/' + userId.toString();

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        success: false,
        error: 'No token found',
      };
    }
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-API-Key': API_KEY,
      },
    });

    const data = (await response.json()) as TodoSetApiResponse[] | ErrorResponse;

    if (!response.ok) {
      return {
        success: false,
        error: 'message' in data ? data.message : 'Failed to get todo items',
      };
    }

    const transformedData = (data as TodoSetApiResponse[]).map(transformTodoSetWithItemsFromApi);

    return {
      success: true,
      data: transformedData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

// TODO: Consider moving the snake_case to PascalCase transformation to the backend API
// for better consistency and maintainability across different clients
