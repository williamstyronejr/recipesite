import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
} from 'react';
import { gql, useQuery } from '@apollo/client';
import Loading from '@/components/ui/Loading';
import { getCookie } from '../utils/utils';

interface State {
  id: number | null;
  username: string | null;
  token: string | null;
  authenticated: boolean;
  authenticating: boolean;
}

const QUERY_SESSION = gql`
  query getSession {
    getSession {
      id
      username
    }
  }
`;

const initState: State = {
  authenticated: false,
  authenticating: true,
  id: null,
  username: null,
  token: null,
};

const AuthContext = createContext({});

function authReducer(state: State, action: { type: String; payload?: any }) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
        authenticating: false,
        id: action.payload.id,
        token: action.payload.token,
        username: action.payload.username,
      };

    case 'SIGNOUT':
      return {
        ...state,
        authenticated: false,
        authenticating: false,
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        authenticating: false,
      };

    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
}

export const AuthProvider = (props: any) => {
  const [state, dispatch] = useReducer(authReducer, initState);
  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch]
  );

  const { loading, data, error } = useQuery(QUERY_SESSION);

  useEffect(() => {
    if (data && data.getSession) {
      dispatch({
        type: 'LOGIN',
        payload: data.getSession,
      });
    } else if (error) {
      dispatch({
        type: 'AUTH_ERROR',
      });
    }
  }, [data, error]);

  if (loading || value.state.authenticating) return <Loading />;

  return <AuthContext.Provider value={value} {...props} />;
};

export function useAuthContext(): {
  state: State;
  login: Function;
  signout: Function;
} {
  const context = useContext(AuthContext) as any;
  if (!context)
    throw new Error('useAuthContext must be inside of authProvider!');
  const { state, dispatch } = context;

  function login(userData: any) {
    dispatch({
      type: 'LOGIN',
      payload: userData,
    });
  }

  function signout() {
    const token = getCookie('csrf-token') || '';

    fetch(
      '/api/signout',

      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'csrf-token': token,
        },
      }
    )
      .then((res) => res.json())
      .then(() => {
        dispatch({
          type: 'SIGNOUT',
        });
      })
      .catch(() => {});
  }

  return {
    state,
    login,
    signout,
  };
}
