import { useState, SyntheticEvent } from 'react';
import { gql, useMutation } from '@apollo/client';
import Head from 'next/head';

const MUTATION_RECOVERY = gql`
  mutation recovery($email: String!) {
    recovery(email: $email) {
      success
      errors {
        ... on UserInputError {
          path
          message
        }
      }
    }
  }
`;

const RecoveryPage = () => {
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<{
    email?: string;
    general?: string;
  }>({});
  const [success, setSucces] = useState<boolean>(false);

  const [recoverEmail] = useMutation(MUTATION_RECOVERY, {
    update(_, { data: { recovery: res } }) {
      if (res.errors) {
        const errs: any = {};
        res.errors.forEach((error: any) => {
          errs[error.path] = error.message;
        });

        return setErrors(errs);
      }

      setSucces(true);
    },
    onError() {
      setErrors({
        general: 'An error occurred during processing, please try again.',
      });
    },
    variables: { email },
  });

  const submitHandler = (evt: SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setSucces(false);
    if (email === '') return setErrors({ email: 'Must provide email' });
    setErrors({});
    recoverEmail();
  };

  return (
    <section className="recovery">
      <Head>
        <title>Recovery - Reshipi Bukku</title>
      </Head>

      <form className="form" onSubmit={submitHandler}>
        <header className="form__header">
          <h1 className="form__heading">Reset Your Password</h1>
          <p className="form__subheading">
            Please provide the email address you used when you signup for your
            account.
          </p>

          {errors.general ? (
            <div className="form__error" data-cy="error">
              {errors.general}
            </div>
          ) : null}

          {success ? (
            <div className="form__notification" data-cy="success">
              If an account is associated with this email, password reset
              instructions will be sent to this email address.
            </div>
          ) : null}
        </header>

        <fieldset className="form__field">
          <label htmlFor="email" className="form__label">
            <span className="form__labeling">Email</span>

            {errors.email ? (
              <span className="form__label-error" data-cy="field-error">
                {errors.email}
              </span>
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
