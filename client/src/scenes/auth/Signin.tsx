import * as React from 'react';
import { useMutation, gql } from '@apollo/client';
import { Link, useHistory, Redirect } from 'react-router-dom';
import { useAuthContext } from '../../context/auth';
import './styles/index.css';

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        id
        email
        username
        token
      }
      userErrors {
        ... on UserInputError {
          __typename
          path
          message
        }
        ... on WrongCredetials {
          __typename
          path
          message
          reason
        }
      }
    }
  }
`;

const SigninPage = () => {
  const { state, login } = useAuthContext();
  const history = useHistory();
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      if (userData.userErrors && userData.userErrors.length > 0) {
        return setError(userData.userErrors[0].message);
      }

      login(userData.user);
      history.push('/');
    },
    onError() {
      setError('Server error occurred, please try again.');
    },
    variables: {
      username,
      password,
    },
  });

  if (state.authenticated) return <Redirect to="/" />;

  const submitHandler = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setError(null);
    loginUser();
  };

  return (
    <section className="signin">
      <form className="form" onSubmit={submitHandler}>
        <header className="form__header">
          <h3 className="form__heading">Sign in to your account</h3>
          <Link className="form__button form__button--oauth" to="/">
            <img
              className="form__google"
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google logo"
            />
            Sign in with Google
          </Link>

          <hr className="form__divisor" />
        </header>

        {error ? <div className="form__error">{error}</div> : null}

        <fieldset className="form__field">
          <label className="form__label" htmlFor="username">
            <span className="form__labeling">Username</span>
            <input
              id="username"
              className="form__input form__input--text"
              type="text"
              value={username}
              placeholder="Username"
              onChange={(evt) => setUsername(evt.target.value)}
            />
          </label>

          <label className="form__label" htmlFor="password">
            <span className="form__labeling">Password</span>
            <input
              id="password"
              className="form__input form__input--text"
              type="password"
              value={password}
              placeholder="Password"
              onChange={(evt) => setPassword(evt.target.value)}
            />
          </label>
        </fieldset>
        <button
          className="form__button form__button--submit"
          type="submit"
          disabled={loading}
        >
          Signin
        </button>

        <Link className="form__link" to="/recovery" data-cy="forgot">
          Forget you password?
        </Link>
      </form>
    </section>
  );
};

export default SigninPage;
