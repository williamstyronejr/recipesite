import * as React from 'react';
import { useMutation, gql } from '@apollo/client';
import './styles/newsLetter.css';

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

  let notificationTimeout: NodeJS.Timeout | null = null;

  React.useEffect(
    () => () => {
      if (notificationTimeout) clearTimeout(notificationTimeout);
    },
    [notificationTimeout],
  );

  const [joinNewLetter] = useMutation(MUTATION_NEWSLETTERS, {
    update(_, { data: { subscribeToLetter: completed } }) {
      if (completed) {
        setEmail('');
        notificationTimeout = setTimeout(() => {
          setSuccess(false);
        }, 3000);

        setSuccess(true);
      }
    },
    onError() {
      notificationTimeout = setTimeout(() => {
        setErrors({});
      }, 3000);
      setErrors({ general: 'An error occurred please try again.' });
    },
    variables: {
      email,
    },
  });

  function onJoin() {
    if (notificationTimeout) clearTimeout(notificationTimeout);
    setErrors({});
    setSuccess(false);
    joinNewLetter();
  }

  return (
    <section className="newsletter">
      <div
        className={`newsletter__notification ${
          success
            ? 'newsletter__notification--success newsletter__notification--active'
            : ''
        } ${
          errors.general
            ? 'newsletter__notification--error newsletter__notification--active'
            : ''
        }`}
      >
        {errors.general
          ? errors.general
          : 'Look forward to great recipes sent directly to you'}
      </div>

      <header className="newsletter__header">
        <h4 className="newsletter__heading">
          Subscribe to get weekly recipes updates
        </h4>
      </header>

      <div className="newsletter__email">
        <input
          className="newsletter__input"
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

        <button className="newsletter__button" type="button" onClick={onJoin}>
          Subscribe
        </button>
      </div>
    </section>
  );
};

export default NewsLetter;
