import * as React from 'react';
import { Link } from 'react-router-dom';
import './styles/index.css';

const SignupPage = () => {
  const [email, setEmail] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [confirm, setConfirm] = React.useState<string>('');
  const [errors, setError] = React.useState<{ [key: string]: string }>({});

  const validate = (
    inputUsername: string,
    inputEmail: string,
    inputPassword: string,
    inputConfirm: string,
  ) => {
    const err: { [key: string]: string } = {};

    if (inputUsername === '') {
      err.username = 'Must provided username';
    }
    if (inputEmail === '') {
      err.email = 'Must provided email';
    }
    if (inputPassword === '') {
      err.password = 'Must provide password';
    }
    if (inputConfirm === '') {
      err.confirm = 'Must confirm password';
    } else if (inputConfirm !== inputPassword) {
      err.confirm = 'Must match password';
    }

    return err;
  };

  const submitHandler = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();

    setError({});
    const validationError = validate(username, email, password, confirm);
    setError(validationError);

    // Submit Data
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

            <input
              id="email"
              className="form__input form__input--text"
              type="text"
              value={email}
              placeholder="Email"
              onChange={(evt) => setEmail(evt.target.value)}
            />
          </label>
        </fieldset>

        <fieldset className="form__field">
          <label className="form__label" htmlFor="email">
            {errors.username ? (
              <span className="form__label-error">{errors.username}</span>
            ) : null}

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
            {errors.password ? (
              <span className="form__label-error">{errors.password}</span>
            ) : null}

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

        <fieldset className="form__field">
          <label className="form__label" htmlFor="confim">
            {errors.confirm ? (
              <span className="form__label-error">{errors.confirm}</span>
            ) : null}

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

        <button className="form__button form__button--submit" type="submit">
          Signup
        </button>
      </form>
    </section>
  );
};

export default SignupPage;
