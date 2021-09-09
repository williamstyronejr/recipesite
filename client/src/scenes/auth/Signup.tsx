import * as React from 'react';

const SignupPage = () => {
  const [email, setEmail] = React.useState<string>('');

  const submitHandler = () => {};

  return (
    <section>
      <form onSubmit={submitHandler}>
        <fieldset>
          <label htmlFor="email">
            <input
              id="email"
              className=""
              type="text"
              value={email}
              onChange={(evt) => setEmail(evt.target.value)}
            />
          </label>
        </fieldset>

        <button type="submit">Signup</button>
      </form>
    </section>
  );
};

export default SignupPage;
