import * as React from 'react';
import { gql, useMutation } from '@apollo/client';

const MUTATION_RECOVERY = gql`
  mutation recovery($email: String!) {
    recovery(email: $email)
  }
`;

const RecoveryPage = () => {
  const [email, setEmail] = React.useState<string>('');
  const [error, setError] = React.useState<{
    email?: string;
    general?: string;
  }>({});
  const [success, setSucces] = React.useState<boolean>(false);

  const [recoverEmail] = useMutation(MUTATION_RECOVERY, {
    update(_, { data: { recovery: completed } }) {
      if (completed) setSucces(true);
    },
    onError() {
      setError({
        general: 'An error occurred during processing, please try again.',
      });
    },
    variables: { email },
  });

  const submitHandler = (evt: React.SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setSucces(false);
    if (email === '') return setError({ email: 'Must provide email' });
    setError({});
    recoverEmail();
  };

  return (
    <section className="recovery">
      <form className="form" onSubmit={submitHandler}>
        <header className="form__header">
          <h1 className="form__heading">Reset Your Password</h1>
          <p className="form__subheading">
            Please provide the email address you used when you signup for your
            account.
          </p>

          {error.general ? (
            <div className="form__error">{error.general}</div>
          ) : null}

          {success ? (
            <div className="form__notification">
              If an account is associated with this email, password reset
              instructions will be sent to this email address.
            </div>
          ) : null}
        </header>

        <fieldset className="form__field">
          <label htmlFor="email" className="form__label">
            <span className="form__labeling">Email</span>

            {error.email ? (
              <span className="form__label-error">{error.email}</span>
            ) : null}

            <input
              id="email"
              name="email"
              type="text"
              className="form__input form__input--text"
              value={email}
              onChange={(evt) => setEmail(evt.target.value)}
            />
          </label>
        </fieldset>

        <button className="form__button form__button--submit" type="submit">
          Submit
        </button>
      </form>
    </section>
  );
};

export default RecoveryPage;
