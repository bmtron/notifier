export interface User {
  userId: string | null;
  username: string;
  email: string;
  password: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface UserResponse {
  userId: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  token: string;
  status: number;
}

export interface CreateUserResult {
  success: boolean;
  data?: UserResponse;
  error?: string;
}
