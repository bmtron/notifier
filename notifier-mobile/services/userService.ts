import { DEV_AUTH_URL } from '@/globals/constants';
import {
  LoginErrorResponse,
  LoginResponse,
  LoginResult,
  UserLoginResponse,
} from '@/models/userLoginResponse';
import { API_KEY } from '@/secrets';

export const submitUserLogin = async (email: string, password: string): Promise<LoginResult> => {
  const api_key = API_KEY;
  const fullEndpoint = DEV_AUTH_URL + 'login';
  console.log(fullEndpoint);
  let loginResult: LoginResult = {
    success: false,
    loginResponse: null,
    errorResponse: null,
  };
  console.log(JSON.stringify({ Email: email, Password: password }));
  try {
    const result = await fetch(fullEndpoint, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': api_key,
      },
      body: JSON.stringify({ Email: email, Password: password }),
    });

    if (result.ok) {
      loginResult.success = true;
      const loginResponse: LoginResponse = (await result.json()) as LoginResponse;

      loginResult.loginResponse = loginResponse;
      return loginResult;
    } else {
      console.log('how about here?');
      const errorResponse: LoginErrorResponse = {
        message: await result.json(),
        status: result.status,
      };
      loginResult.errorResponse = errorResponse;
      return loginResult;
    }
  } catch (error) {
    console.error('fetch error:', error);
    return loginResult;
  }
};
