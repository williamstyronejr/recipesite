import * as React from 'react';
import { useRouter } from 'next/router';
import { useMutation, gql } from '@apollo/client';
import { useAuthContext } from '@/hooks/useAuth';
import { validateSignup } from '../utils/validators';
import styles from './styles/auth.module.css';

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
  const router = useRouter();
  const [email, setEmail] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [confirm, setConfirm] = React.useState<string>('');
  const [errors, setError] = React.useState<{ [key: string]: string }>({});

  const [createUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      if (userData.userErrors) {
        const errs: any = {};
        userData.userErrors.forEach((error: any) => {
          errs[error.path] = error.message;
        });

        return setError(errs);
      }

      login(userData.user);
      router.push('/');
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

  if (state.authenticated) return router.push('/');

  const submitHandler = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setError({});
    const validateErrors = validateSignup(username, email, password, confirm);
    if (Object.keys(validateErrors).length > 0) return setError(validateErrors);

    createUser();
  };

  return (
    <section className={styles.signup}>
      <form className={styles.form} onSubmit={submitHandler}>
        <header className={styles.form__header}>
          <h3 className={styles.form__heading}>Create an account</h3>

          <hr className={styles.form__divisor} />
        </header>

        {errors.general ? (
          <div className={styles.form__error} data-cy="form-error">
            {errors.general}
          </div>
        ) : null}

        <fieldset className={styles.form__field}>
          <label className={styles.form__label} htmlFor="email">
            <span className={styles.form__labeling}>Email</span>

            {errors.email ? (
              <span className={styles.form__label_error} data-cy="field-error">
                {errors.email}
              </span>
            ) : null}

            <input
              id="email"
              name="email"
              className={`${styles.form__input} ${styles.form__input__text}`}
              type="text"
              value={email}
              placeholder="Email"
              onChange={(evt) => setEmail(evt.target.value)}
            />
          </label>

          <label className={styles.form__label} htmlFor="email">
            <span className={styles.form__labeling}>Username</span>

            {errors.username ? (
              <span className={styles.form__label_error} data-cy="field-error">
                {errors.username}
              </span>
            ) : null}

            <input
              id="username"
              name="username"
              className={`${styles.form__input} ${styles.form__input__text}`}
              type="text"
              value={username}
              placeholder="Username"
              onChange={(evt) => setUsername(evt.target.value)}
            />
          </label>

          <label className={styles.form__label} htmlFor="password">
            <span className={styles.form__labeling}>Password</span>

            {errors.password ? (
              <span className={styles.form__label_error} data-cy="field-error">
                {errors.password}
              </span>
            ) : null}

            <input
              id="password"
              name="password"
              className={`${styles.form__input} ${styles.form__input__text}`}
              type="password"
              value={password}
              placeholder="Password"
              onChange={(evt) => setPassword(evt.target.value)}
            />
          </label>

          <label className={styles.form__label} htmlFor="confirm">
            <span className={styles.form__labeling}>Confirm Password</span>

            {errors.confirmPassword ? (
              <span className={styles.form__label_error} data-cy="field-error">
                {errors.confirmPassword}
              </span>
            ) : null}

            <input
              id="confirm"
              name="confirm"
              className={`${styles.form__input} ${styles.form__input__text}`}
              type="password"
              value={confirm}
              placeholder="Confirm password"
              onChange={(evt) => setConfirm(evt.target.value)}
            />
          </label>
        </fieldset>

        <button
          className={`${styles.form__button} ${styles.form__button__submit}`}
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
