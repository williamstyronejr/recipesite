import * as React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useAuthContext } from '../../context/auth';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  validatePasswordUpdate,
  validateAccountUpdate,
} from '../../utils/validators';
import Loading from '../../components/Loading';
import './styles/settings.css';

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
    ) {
      success
      updateErrors {
        ... on UserInputError {
          __typename
          path
          message
        }
        ... on WrongCredetials {
          __typename
          path
          message
          reason
        }
      }
    }
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
    ) {
      success
      updateErrors {
        ... on UserInputError {
          path
          message
        }
      }
    }
  }
`;

const MUTATION_DELETE = gql`
  mutation deleteAccount {
    deleteAccount
  }
`;

const QUERY_USER = gql`
  query {
    getSettings {
      username
      email
      bio
      profileImage
    }
  }
`;

const PasswordForm = () => {
  const [oldPassword, setOldPassword] = React.useState<string>('');
  const [newPassword, setNewPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  const [status, setStatus] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const [updatePassword, { loading }] = useMutation(MUTATION_PASSWORD, {
    update(_, { data: { updatePassword: res } }) {
      if (res.updateErrors) {
        const errs: any = {};
        res.updateErrors.forEach((error: any) => {
          errs[error.path] = error.message;
        });

        return setErrors(errs);
      }

      setStatus(true);
    },
    onError() {
      setErrors({ general: 'Server error occurred, please try again.' });
    },
    variables: {
      oldPassword,
      newPassword,
      confirmPassword,
    },
  });

  function handleSubmit(evt: React.SyntheticEvent<HTMLFormElement>) {
    evt.preventDefault();
    setStatus(false);

    const validateErrors = validatePasswordUpdate(
      oldPassword,
      newPassword,
      confirmPassword,
    );
    if (Object.keys(validateErrors).length > 0)
      return setErrors(validateErrors);

    setErrors({});
    updatePassword();
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <header className="form__header">
        {status ? (
          <div className="form__notification" data-cy="form-notification">
            Your password has been successfully updated.
          </div>
        ) : null}

        {errors.general ? (
          <div className="form__error" data-cy="form-error">
            {errors.general}
          </div>
        ) : null}
      </header>

      <fieldset className="form__field">
        <label className="form__label" htmlFor="oldPassword">
          <span className="form__labeling">Old Password</span>

          {errors.oldPassword ? (
            <span className="form__label-error" data-cy="field-error">
              {errors.oldPassword}
            </span>
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
            <span className="form__label-error" data-cy="field-error">
              {errors.newPassword}
            </span>
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
            <span className="form__label-error" data-cy="field-error">
              {errors.confirmPassword}
            </span>
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
  signout,
  initialUsername,
  initialEmail,
  initialBio,
  initialImage,
}: {
  // unauth: Function;
  signout: Function;
  initialUsername: string;
  initialEmail: string;
  initialBio: string;
  initialImage: string;
}) => {
  const [username, setUsername] = React.useState<string>(initialUsername);
  const [email, setEmail] = React.useState<string>(initialEmail);
  const [bio, setBio] = React.useState<string>(initialBio);
  const [status, setStatus] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [confirmVisible, setConfirmVisible] = React.useState(false);
  const fileRef = React.createRef<HTMLInputElement>();

  const [updateAccount, { loading }] = useMutation(MUTATION_ACCOUNT, {
    update(_: any, { data: { updateAccount: res } }) {
      if (res.updateErrors) {
        const errs: any = {};
        res.updateErrors.forEach((error: any) => {
          errs[error.path] = error.message;
        });

        return setErrors(errs);
      }

      setStatus(true);
    },
    onError() {
      setErrors({ general: 'Server error occurred, please try again.' });
    },
  });

  const [deleteAccount] = useMutation(MUTATION_DELETE, {
    update(_: any, { data: { deleteAccount: deleted } }) {
      if (deleted) return signout();
      setErrors({
        general: 'An error has occurred, please try again.',
      });
    },
  });

  function submitHandler(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setStatus(false);

    const validateErrors = validateAccountUpdate(username, email);

    if (Object.keys(validateErrors).length > 0)
      return setErrors(validateErrors);

    setErrors({});

    const params: any = {};
    if (username !== initialUsername) params.username = username;
    if (email !== initialEmail) params.email = email;
    if (bio !== initialBio) params.bio = bio;

    updateAccount({
      variables: params,
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
        {status ? (
          <div className="form__notification" data-cy="form-notification">
            Your account has been updated.
          </div>
        ) : null}

        {errors.general ? (
          <div className="form__error" data-cy="form-error">
            {errors.general}
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
            disabled={initialImage === 'default.jpg'}
            onClick={() => uploadProfileImage(null, true)}
          >
            Remove Profile Image
          </button>
        </label>

        <label htmlFor="username" className="form__label">
          <span className="form__labeling">Username</span>
          {errors.username ? (
            <span className="form__label-error" data-cy="field-error">
              {errors.username}
            </span>
          ) : null}
          <input
            id="username"
            name="username"
            className="form__input form__input--text"
            type="text"
            value={username}
            onChange={(evt) => setUsername(evt.target.value)}
          />
        </label>

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
            className="form__input form__input--text"
            type="text"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
          />
        </label>

        <label htmlFor="bio" className="form__label">
          <span className="form__labeling">About You</span>

          {errors.bio ? (
            <span className="form__label-error" data-cy="field-error">
              {errors.bio}
            </span>
          ) : null}

          <textarea
            id="bio"
            name="bio"
            className="form__input form__input--textarea"
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
          data-cy="delete"
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
  const { signout } = useAuthContext();
  const [selected, setSelected] = React.useState('account');
  const { loading, data } = useQuery(QUERY_USER, { fetchPolicy: 'no-cache' });

  if (loading || !data) return <Loading />;
  const { username, email, bio, profileImage } = data.getSettings;

  const settings =
    selected === 'account' ? (
      <AccountForm
        initialImage={profileImage}
        initialUsername={username}
        initialEmail={email}
        initialBio={bio}
        signout={signout}
      />
    ) : (
      <PasswordForm />
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
