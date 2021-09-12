import * as React from 'react';
import { Link } from 'react-router-dom';
import './styles/index.css';

const SigninPage = () => {
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);

  const submitHandler = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();

    setError(null);
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
          <label className="form__label" htmlFor="email">
            <input
              id="username"
              className="form__input form__input--text"
              type="text"
              value={username}
              placeholder="Username"
              onChange={(evt) => setUsername(evt.target.value)}
            />
          </label>
        </fieldset>

        <fieldset className="form__field">
          <label className="form__label" htmlFor="password">
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
        <button className="form__button form__button--submit" type="submit">
          Signup
        </button>

        <Link className="form__link" to="/recovery">
          Forget you password?
        </Link>
      </form>
    </section>
  );
};

export default SigninPage;
