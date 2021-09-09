import * as React from 'react';

const SigninPage = () => {
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const onSubmit = () => {};

  return (
    <section className="">
      <form onSubmit={onSubmit}>
        <fieldset>
          <label htmlFor="username">
            <input
              id="username"
              className=""
              type="text"
              value={username}
              onChange={(evt) => setUsername(evt.target.value)}
            />
          </label>

          <label htmlFor="password">
            <input
              id="password"
              className=""
              type="password"
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
            />
          </label>

          <button type="submit">Signin</button>
        </fieldset>
      </form>
    </section>
  );
};

export default SigninPage;
