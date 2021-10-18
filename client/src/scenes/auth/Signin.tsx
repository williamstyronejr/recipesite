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
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      if (userData.userErrors && userData.userErrors.length > 0) {
        const errs: any = {};
        userData.userErrors.forEach((error: any) => {
          errs[error.path] = error.message;
        });
        return setErrors(errs);
      }

      login(userData.user);
      history.push('/');
    },
    onError() {
      setErrors({ general: 'Server error occurred, please try again.' });
    },
    variables: {
      username,
      password,
    },
  });

  if (state.authenticated) return <Redirect to="/" />;

  const submitHandler = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const validateErrors: any = {};
    if (username.trim() === '') {
      validateErrors.username = 'Username must be provided';
    }

    if (password.trim() === '') {
      validateErrors.password = 'Password must be provided';
    }

    if (Object.keys(validateErrors).length > 0)
      return setErrors(validateErrors);

    setErrors({});
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

        {errors.general ? (
          <div className="form__error" data-cy="form-error">
            {errors.general}
          </div>
        ) : null}

        <fieldset className="form__field">
          <label className="form__label" htmlFor="username">
            <span className="form__labeling">Username</span>
            {errors.username ? (
              <span className="form__label-error" data-cy="field-error">
                {errors.username}
              </span>
            ) : null}

            <input
              id="username"
              name="username"
              className="form__input form__input--text"
              type="text"
              value={username}
              placeholder="Username"
              onChange={(evt) => setUsername(evt.target.value)}
            />
          </label>

          <label className="form__label" htmlFor="password">
            <span className="form__labeling">Password</span>
            {errors.password ? (
              <span className="form__label-error" data-cy="field-error">
                {errors.password}
              </span>
            ) : null}

            <input
              id="password"
              name="password"
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
