import { User, UserResponse, CreateUserResult } from '../../utils/models/User'

import { createItem } from './createItem'

export const createUser = async (user: User): Promise<CreateUserResult> => {
  return createItem<UserResponse>(user, '/api/users')
}
