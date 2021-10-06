import * as React from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { useAuthContext } from '../../context/auth';
import './styles/index.css';

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
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
      }
    }
  }
`;

const SignupPage = () => {
  const { state, login } = useAuthContext();
  const history = useHistory();
  const [email, setEmail] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [confirm, setConfirm] = React.useState<string>('');
  const [errors, setError] = React.useState<{ [key: string]: string }>({});

  const [createUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      if (userData.userErrors) {
        // eslint-disable-next-line prefer-object-spread
        const errs: any = {};
        userData.userErrors.forEach((error: any) => {
          errs[error.path] = error.message;
        });

        return setError(errs);
      }

      login(userData.user);
      history.push('/');
    },
    onError() {
      setError({ general: 'Server error occurred, please try again.' });
    },
    variables: {
      username,
      email,
      password,
      confirmPassword: confirm,
    },
  });

  if (state.authenticated) return <Redirect to="/" />;

  const submitHandler = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setError({});
    createUser();
  };

  return (
    <section className="signup">
      <form className="form" onSubmit={submitHandler}>
        <header className="form__header">
          <h3 className="form__heading">Create an account</h3>
          <Link className="form__button form__button--oauth" to="/">
            <img
              className="form__google"
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google logo"
            />
            Sign up with Google
          </Link>

          <hr className="form__divisor" />
        </header>

        <fieldset className="form__field">
          <label className="form__label" htmlFor="email">
            {errors.email ? (
              <span className="form__label-error">{errors.email}</span>
            ) : null}

            <span className="form__labeling">Email</span>
            <input
              id="email"
              className="form__input form__input--text"
              type="text"
              value={email}
              placeholder="Email"
              onChange={(evt) => setEmail(evt.target.value)}
            />
          </label>

          <label className="form__label" htmlFor="email">
            {errors.username ? (
              <span className="form__label-error">{errors.username}</span>
            ) : null}

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
            {errors.password ? (
              <span className="form__label-error">{errors.password}</span>
            ) : null}

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

          <label className="form__label" htmlFor="confirm">
            {errors.confirmPassword ? (
              <span className="form__label-error">
                {errors.confirmPassword}
              </span>
            ) : null}

            <span className="form__labeling">Confirm Password</span>
            <input
              id="confirm"
              className="form__input form__input--text"
              type="password"
              value={confirm}
              placeholder="Confirm password"
              onChange={(evt) => setConfirm(evt.target.value)}
            />
          </label>
        </fieldset>

        <button
          className="form__button form__button--submit"
          type="submit"
          disabled={loading}
        >
          Signup
        </button>
      </form>
    </section>
  );
};

export default SignupPage;
