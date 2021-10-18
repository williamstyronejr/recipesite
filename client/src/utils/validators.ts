type Errors = {
  [U: string]: string;
};

export function validateSignup(
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
): Errors {
  const errors: Errors = {};

  if (username.trim() === '') {
    errors.username = 'Username must be provided';
  } else if (username.trim().length < 4) {
    errors.username = 'Username must be between 4 and 16 characters';
  }

  if (email.trim() === '') {
    errors.email = 'Email must be provided';
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address';
    }
  }

  if (password.trim() === '') {
    errors.password = 'Password must be provided';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = ' Password must match';
  }

  return errors;
}
