import * as React from 'react';
import { useMutation, gql } from '@apollo/client';
import styles from './styles/newsletter.module.css';

const MUTATION_NEWSLETTERS = gql`
  mutation subscribeToLetter($email: String!) {
    subscribeToLetter(email: $email)
  }
`;

const NewsLetter = () => {
  const [email, setEmail] = React.useState<string>('');
  const [success, setSuccess] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<{
    general?: string;
    email?: string;
  }>({});

  let notificationTimeout: number | null = null;

  React.useEffect(
    () => () => {
      if (notificationTimeout) window.clearTimeout(notificationTimeout);
    },
    [notificationTimeout]
  );

  const [joinNewLetter] = useMutation(MUTATION_NEWSLETTERS, {
    update(_, { data: { subscribeToLetter: completed } }) {
      if (completed) {
        setEmail('');
        notificationTimeout = window.setTimeout(() => {
          setSuccess(false);
        }, 3000);

        setSuccess(true);
      }
    },
    onError() {
      notificationTimeout = window.setTimeout(() => {
        setErrors({});
      }, 3000);
      setErrors({ general: 'An error occurred please try again.' });
    },
    variables: {
      email,
    },
  });

  function onJoin() {
    if (notificationTimeout) window.clearTimeout(notificationTimeout);
    setErrors({});
    setSuccess(false);
    joinNewLetter();
  }

  return (
    <section className={styles.newsletter}>
      <div
        className={`${styles.newsletter__notification} ${
          success
            ? `${styles.newsletter__notification__success} ${styles.newsletter__notification__active}`
            : ''
        } ${
          errors.general
            ? `${styles.newsletter__notification__error} ${styles.newsletter__notification__active}`
            : ''
        }`}
      >
        {errors.general
          ? errors.general
          : 'Look forward to great recipes sent directly to you'}
      </div>

      <header className={styles.newsletter__header}>
        <h4 className={styles.newsletter__heading}>
          Subscribe to get weekly recipes updates
        </h4>
      </header>

      <div className={styles.newsletter__email}>
        <input
          className={styles.newsletter__input}
          id="email"
          name="email"
          type="text"
          placeholder="Enter your email here"
          value={email}
          onKeyUp={(evt) => {
            if (evt.key === 'Enter') {
              onJoin();
            }
          }}
          onChange={(evt) => setEmail(evt.target.value)}
        />

        <button
          className={styles.newsletter__button}
          type="button"
          onClick={onJoin}
          data-cy="submit"
        >
          Subscribe
        </button>
      </div>
    </section>
  );
};

export default NewsLetter;
