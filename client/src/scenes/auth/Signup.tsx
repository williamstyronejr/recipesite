import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
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
      id
      email
      username
      token
    }
  }
`;

const SignupPage = () => {
  const { state, login } = useAuthContext();
  const [email, setEmail] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [confirm, setConfirm] = React.useState<string>('');
  const [errors, setError] = React.useState<{ [key: string]: string }>({});

  const [createUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      login(userData);
    },
    onError(err) {
      if (err.graphQLErrors[0] && err.graphQLErrors[0].extensions) {
        setError(err.graphQLErrors[0].extensions.errors);
      }
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

          <label className="form__label" htmlFor="confim">
            {errors.confirm ? (
              <span className="form__label-error">{errors.confirm}</span>
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
