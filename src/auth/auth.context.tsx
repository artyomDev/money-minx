import React, { createContext } from 'react';

import { storage } from 'app/app.storage';
import { StorageKey } from 'app/app.types';
import { Children, Dispatch } from 'common/common.types';

import { AuthType } from './auth.types';
import { AuthState } from './auth.enum';
import { auth, subscription } from './auth-context.types';

const initialState: AuthType = {
  email: '',
  expires: undefined,
  onboarded: undefined,
  user: undefined,
  token: undefined,
  roles: undefined,
  isSigningIn: false,
  accounts: [],
  isAuthenticated: false,
  authState: AuthState.INITIAL,
  subscriptionDetail: undefined,
};

const AuthStateContext = createContext<AuthType | undefined>(undefined);
const AuthDispatchContext = createContext<Dispatch | undefined>(undefined);

function authReducer(state: AuthType = initialState, action: any) {
  switch (action.type) {
    case auth.LOGIN: {
      return { ...state, state: AuthState.AUTHENTICATING };
    }

    case auth.LOGIN_SUCCESS: {
      storage.set(StorageKey.AUTH, action.payload);
      return {
        ...state,
        isSigningIn: false,
        isAuthenticated: true,
        token: action.payload.token,
        expires: action.payload.expires,
        authState: AuthState.AUTHENTICATED,
        onboarded: action.payload.onboarded,
      };
    }

    case auth.LOGIN_FAILURE: {
      return { ...state, authState: AuthState.SIGN_IN_REJECTED, isAuthenticated: false };
    }

    case auth.REGISTER: {
      return { ...state, isSigningIn: true };
    }

    case auth.REGISTER_SUCCESS: {
      storage.set(StorageKey.AUTH, action.payload);
      return {
        ...state,
        isSigningIn: false,
        isAuthenticated: true,
        token: action.payload.token,
        expires: action.payload.expires,
        authState: AuthState.AUTHENTICATED,
        onboarded: action.payload.onboarded,
      };
    }

    case auth.REGISTER_FAILURE: {
      return { ...state, authState: AuthState.SIGN_IN_REJECTED, isAuthenticated: false };
    }

    case auth.PROFILE_REFRESH_SUCCESS: {
      return { ...state, user: action.payload.user };
    }

    case auth.SIGN_OUT: {
      return { ...state, authState: AuthState.LOGGING_OUT };
    }

    case auth.SIGN_OUT_SUCCESS: {
      storage.clear();
      return { ...state, isAuthenticated: false, authState: AuthState.LOGGED_OUT };
    }

    case auth.SIGN_OUT_FAILURE: {
      return { ...state, authState: AuthState.LOG_OUT_REJECTED };
    }

    case auth.FETCH_ACCOUNT: {
      return { ...state };
    }
    case auth.FETCH_ACCOUNT_SUCCESS: {
      return { ...state, accounts: action.payload.user };
    }
    case auth.FETCH_ACCOUNT_FAILURE: {
      return { ...state };
    }

    case auth.FETCH_PROFILE: {
      return { ...state };
    }
    case auth.FETCH_PROFILE_SUCCESS: {
      return { ...state, user: action.payload.user };
    }
    case auth.FETCH_PROFILE_FAILURE: {
      return { ...state };
    }
    case auth.UPDATE_EMAIL_ADDRESS: {
      return { ...state, email: action.email };
    }

    case subscription.SET_SUBSCRIPTION_DETAIL: {
      return { ...state, subscriptionDetail: action.payload.subscriptionDetail };
    }

    default: {
      return { ...state };
    }
  }
}

function AuthProvider({ children }: Children) {
  const [state, dispatch] = React.useReducer(authReducer, initialState);
  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}

function useAuthState() {
  const context = React.useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a Auth Provider');
  }
  return context;
}

function useAuthDispatch() {
  const context = React.useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('appDispatch must be used within a Auth Provider');
  }
  return context;
}

export { AuthProvider, useAuthDispatch, useAuthState };
