import { UserState } from '../rootState';

const initialUserState: UserState = {
  userId: 0,
  isAuthorized: false,
  authToken: '',
};
export enum UserActions {
  SetUserId = 'SET_USER_ID_ACTION',
  SetIsAuthorized = 'SET_IS_AUTHORIZED_ACTION',
  SetAuthToken = 'SET_AUTH_TOKEN_ACTION',
  SetUserStateFull = 'SET_USER_STATE_FULL_ACTION',
}
export interface SetUserIdAction {
  type: UserActions.SetUserId;
  payload: number;
}

export interface SetIsAuthorizedAction {
  type: UserActions.SetIsAuthorized;
  payload: boolean;
}

export interface SetAuthTokenAction {
  type: UserActions.SetAuthToken;
  payload: string;
}

export interface SetUserStateFullAction {
  type: UserActions.SetUserStateFull;
  payload: UserState;
}
export type UserAction =
  | SetUserIdAction
  | SetIsAuthorizedAction
  | SetAuthTokenAction
  | SetUserStateFullAction;

const UserReducer = (userState: UserState = initialUserState, action: UserAction) => {
  switch (action.type) {
    case 'SET_USER_ID_ACTION':
      return {
        ...userState,
        userId: action.payload,
      };
    case 'SET_IS_AUTHORIZED_ACTION':
      return {
        ...userState,
        isAuthorized: action.payload,
      };
    case 'SET_AUTH_TOKEN_ACTION':
      return {
        ...userState,
        authToken: action.payload,
      };
    case 'SET_USER_STATE_FULL_ACTION':
      return action.payload;

    default:
      return userState;
  }
};

export default UserReducer;
