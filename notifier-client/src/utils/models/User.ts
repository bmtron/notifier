export interface User {
  UserId: string | null
  Username: string
  Email: string
  Password: string
  CreatedAt: Date | null
  UpdatedAt: Date | null
}

export interface UserResponse {
  UserId: string
  Username: string
  Email: string
  CreatedAt: Date
  UpdatedAt: Date
  Token: string
  Status: number
}

export interface CreateUserResult {
  success: boolean
  data?: UserResponse
  error?: string
}
