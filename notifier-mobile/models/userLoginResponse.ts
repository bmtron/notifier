export interface UserLoginResponse {
  ID: number;
  Email: string;
  Name: string;
}

export interface LoginResponse {
  token: string;
  user: UserLoginResponse;
}

export interface LoginErrorResponse {
  message: string;
  status: number;
}

export interface LoginResult {
  success: boolean;
  loginResponse: LoginResponse | null;
  errorResponse: LoginErrorResponse | null;
}
