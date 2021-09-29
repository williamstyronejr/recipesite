import * as React from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useAuthContext } from '../../context/auth';
import ConfirmDialog from '../../components/ConfirmDialog';
import './styles/settings.css';
import Loading from '../../components/Loading';

const MUTATION_PASSWORD = gql`
  mutation updatePassword(
    $oldPassword: String!
    $newPassword: String!
    $confirmPassword: String!
  ) {
    updatePassword(
      oldPassword: $oldPassword
      newPassword: $newPassword
      confirmPassword: $confirmPassword
    )
  }
`;

const MUTATION_ACCOUNT = gql`
  mutation updateAccount(
    $username: String
    $email: String
    $bio: String
    $profileImage: Upload
    $removeProfileImage: Boolean
  ) {
    updateAccount(
      username: $username
      email: $email
      bio: $bio
      profileImage: $profileImage
      removeProfileImage: $removeProfileImage
    )
  }
`;

const MUTATION_DELETE = gql`
  mutation deleteAccount {
    deleteAccount
  }
`;

const QUERY_USER = gql`
  query {
    getSession {
      username
      email
      bio
      profileImage
    }
  }
`;

const PasswordForm = ({ unauth }: { unauth: Function }) => {
  const [oldPassword, setOldPassword] = React.useState<string>('');
  const [newPassword, setNewPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const [updatePassword, { loading, data }] = useMutation(MUTATION_PASSWORD, {
    onError({ graphQLErrors }) {
      if (graphQLErrors && graphQLErrors[0].extensions) {
        if (graphQLErrors[0].extensions.code === 'UNAUTHENTICATED') {
          unauth();
        } else {
          setErrors(graphQLErrors[0].extensions.errors);
        }
      }
    },
    variables: {
      oldPassword,
      newPassword,
      confirmPassword,
    },
  });

  function handleSubmit(evt: React.SyntheticEvent<HTMLFormElement>) {
    evt.preventDefault();
    setErrors({});
    updatePassword();
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <header className="form__header">
        {data && data.updatePassword ? (
          <div className="form__notification">
            Your password has been successfully updated.
          </div>
        ) : null}
      </header>
      <fieldset className="form__field">
        <label className="form__label" htmlFor="oldPassword">
          <span className="form__labeling">Old Password</span>
          {errors.oldPassword ? (
            <span className="form__label-error">{errors.oldPassword}</span>
          ) : null}

          <input
            id="oldPassword"
            name="oldPassword"
            className="form__input form__input--text"
            type="password"
            value={oldPassword}
            placeholder="old password"
            onChange={(evt) => setOldPassword(evt.target.value)}
          />
        </label>

        <label className="form__label" htmlFor="newPassword">
          <span className="form__labeling">New Password</span>
          {errors.newPassword ? (
            <span className="form__label-error">{errors.newPassword}</span>
          ) : null}
          <input
            id="newPassword"
            name="newPassword"
            className="form__input form__input--text"
            type="password"
            value={newPassword}
            placeholder="new password"
            onChange={(evt) => setNewPassword(evt.target.value)}
          />
        </label>

        <label className="form__label" htmlFor="confirmPassword">
          <span className="form__labeling">Confirm New Password</span>
          {errors.confirmPassword ? (
            <span className="form__label-error">{errors.confirmPassword}</span>
          ) : null}
          <input
            id="confirmPassword"
            name="confirmPassword"
            className="form__input form__input--text"
            type="password"
            value={confirmPassword}
            placeholder="confirm password"
            onChange={(evt) => setConfirmPassword(evt.target.value)}
          />
        </label>
      </fieldset>

      <button
        className="form__button form__button--submit"
        type="submit"
        disabled={loading}
      >
        Update Password
      </button>
    </form>
  );
};

const AccountForm = ({
  unauth,
  signout,
  initialUsername,
  initialEmail,
  initialBio,
  initialImage,
}: {
  unauth: Function;
  signout: Function;
  initialUsername: string;
  initialEmail: string;
  initialBio: string;
  initialImage: string;
}) => {
  const [username, setUsername] = React.useState<string>(initialUsername);
  const [email, setEmail] = React.useState<string>(initialEmail);
  const [bio, setBio] = React.useState<string>(initialBio);
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [confirmVisible, setConfirmVisible] = React.useState(false);
  const fileRef = React.createRef<HTMLInputElement>();

  const [updateAccount, { loading, data }] = useMutation(MUTATION_ACCOUNT, {
    onError({ graphQLErrors }) {
      if (graphQLErrors && graphQLErrors[0].extensions) {
        if (graphQLErrors[0].extensions.code === 'UNAUTHENTICATED') {
          unauth();
        } else {
          setErrors(graphQLErrors[0].extensions.errors);
        }
      }
    },
  });

  const [deleteAccount] = useMutation(MUTATION_DELETE, {
    update(_: any, { data: { deleteAccount: deleted } }) {
      if (deleted) signout();
    },
  });

  function submitHandler(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setErrors({});
    updateAccount({
      variables: {
        username: username !== '' ? username : undefined,
        email: email !== '' ? email : undefined,
        bio,
      },
    });
  }

  function uploadProfileImage(file: any, remove = false) {
    if (file) {
      updateAccount({ variables: { profileImage: file } });
    } else {
      updateAccount({ variables: { removeProfileImage: remove } });
    }
  }

  return (
    <form className="form" onSubmit={submitHandler}>
      <header className="form__header">
        {data ? (
          <div className="form__notification">
            Your account has been updated.
          </div>
        ) : null}

        {confirmVisible ? (
          <ConfirmDialog
            message="Are you sure you want to delete your account? This action can not be reversed."
            onConfirm={() => {
              setConfirmVisible(false);
              deleteAccount();
            }}
            onCancel={() => setConfirmVisible(false)}
          />
        ) : null}
      </header>

      <fieldset className="form__field">
        <label htmlFor="profileImage" className="form__labeling">
          <button
            className="form__button form__button--file"
            type="button"
            onClick={() => {
              fileRef.current?.click();
            }}
          >
            <img
              className="form__preview"
              src={
                initialImage.startsWith('http')
                  ? initialImage
                  : `/img/${initialImage}`
              }
              alt="Profile"
            />
          </button>

          <input
            id="profileImage"
            name="profileImage"
            className="form__input form__input--file"
            type="file"
            ref={fileRef}
            onChange={(evt) =>
              uploadProfileImage(evt.target.files ? evt.target.files[0] : null)
            }
          />

          <button
            className="form__button form__button--remove"
            type="button"
            onClick={() => uploadProfileImage(null, true)}
          >
            Remove Profile Image
          </button>
        </label>

        <label htmlFor="username" className="form__label">
          <span className="form__labeling">Username</span>
          {errors.username ? (
            <span className="form__label-error">{errors.username}</span>
          ) : null}
          <input
            id="username"
            className="form__input form__input--text"
            name="username"
            type="text"
            value={username}
            onChange={(evt) => setUsername(evt.target.value)}
          />
        </label>

        <label htmlFor="email" className="form__label">
          <span className="form__labeling">Email</span>
          {errors.email ? (
            <span className="form__label-error">{errors.email}</span>
          ) : null}
          <input
            id="email"
            className="form__input form__input--text"
            name="email"
            type="text"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
          />
        </label>

        <label htmlFor="bio" className="form__label">
          <span className="form__labeling">About You</span>
          {errors.bio ? (
            <span className="form__label-error">{errors.bio}</span>
          ) : null}
          <textarea
            id="bio"
            className="form__input form__input--textarea"
            name="bio"
            value={bio}
            onChange={(evt) => setBio(evt.target.value)}
          />
        </label>
      </fieldset>

      <button
        className="form__button form__button--submit"
        type="submit"
        disabled={loading}
      >
        Update
      </button>

      <fieldset className="form__field ">
        <span className="form__labeling form__labeling--split">
          Delete Account
        </span>
        <button
          className="form__button form__button--delete"
          type="button"
          onClick={() => setConfirmVisible(true)}
        >
          Delete your account
        </button>
      </fieldset>
    </form>
  );
};

const SettingsPage = () => {
  const { state, signout } = useAuthContext();
  const history = useHistory();
  const [selected, setSelected] = React.useState('account');
  const { loading, data } = useQuery(QUERY_USER);

  if (!state.authenticated) return <Redirect to="/signin" />;
  if (loading) return <Loading />;
  const { username, email, bio, profileImage } = data.getSession;

  const onUnauth = () => history.push('/signin');

  const settings =
    selected === 'account' ? (
      <AccountForm
        unauth={onUnauth}
        initialImage={profileImage}
        initialUsername={username}
        initialEmail={email}
        initialBio={bio}
        signout={signout}
      />
    ) : (
      <PasswordForm unauth={onUnauth} />
    );

  return (
    <section className="settings">
      <aside className="settings__aside">
        <button
          className={`settings__link ${
            selected === 'account' ? 'settings__link--active' : ''
          }`}
          type="button"
          onClick={() => setSelected('account')}
        >
          Account
        </button>

        <button
          className={`settings__link ${
            selected === 'password' ? 'settings__link--active' : ''
          }`}
          type="button"
          onClick={() => setSelected('password')}
        >
          Password
        </button>
      </aside>

      <div className="settings__content">{settings}</div>
    </section>
  );
};

export default SettingsPage;
