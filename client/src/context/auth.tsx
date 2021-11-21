import * as React from 'react';
import { gql, useQuery } from '@apollo/client';
import FullScreenLoading from '../components/FullScreenLoading';
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

const AuthContext = React.createContext({});

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
  const [state, dispatch] = React.useReducer(authReducer, initState);
  const value = React.useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch],
  );

  const { loading, data, error } = useQuery(QUERY_SESSION);

  React.useEffect(() => {
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

  if (loading || value.state.authenticating) return <FullScreenLoading />;

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <AuthContext.Provider value={value} {...props} />;
};

export function useAuthContext(): {
  state: State;
  login: Function;
  signout: Function;
} {
  const context = React.useContext(AuthContext) as any;
  if (!context) throw new Error('authContext must be inside of authProvider!');
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
      '/signout',

      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'csrf-token': token,
        },
      },
    )
      .then((res) => res.json())
      .then(() => {
        dispatch({
          type: 'SIGNOUT',
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return {
    state,
    login,
    signout,
  };
}
