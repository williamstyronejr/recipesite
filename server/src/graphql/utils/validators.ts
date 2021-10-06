type Error = Array<{ path: string; message: string }>;

interface Validator {
  errors: Error;
  valid: boolean;
}

export function validateRegister(
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
): Validator {
  const errors: Error = [];

  if (username.trim() === '') {
    errors.push({ path: 'username', message: 'Username must be provided' });
  } else if (username.trim().length < 4) {
    errors.push({
      path: 'username',
      message: 'Username must be between 4 and 16 characters',
    });
  }

  if (email.trim() === '') {
    errors.push({
      path: 'email',
      message: 'Email must be provided',
    });
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.push({
        message: 'Email must be a valid email address',
        path: 'email',
      });
    }
  }

  if (password.trim() === '') {
    errors.push({
      path: 'password',
      message: 'Password must be provided',
    });
  } else if (password !== confirmPassword) {
    errors.push({
      path: 'confirmPassword',
      message: 'Password must match',
    });
  }

  return {
    errors,
    valid: errors.length === 0,
  };
}

export function validateLogin(username: string, password: string): Validator {
  const errors: Error = [];

  if (username.trim() === '') {
    errors.push({
      path: 'username',
      message: 'Username must be provided',
    });
  }
  if (password.trim() === '') {
    errors.push({
      path: 'password',
      message: 'Password must be provided',
    });
  }

  return {
    errors,
    valid: errors.length === 0,
  };
}

export function validatePasswordChange(
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
): Validator {
  const errors: Error = [];

  if (oldPassword.trim() === '') {
    errors.push({
      path: 'oldPassword',
      message: 'Old password must be provided',
    });
  }

  if (newPassword.trim() === '') {
    errors.push({
      path: 'newPassword',
      message: 'New password must be provided',
    });
  }

  if (newPassword !== confirmPassword) {
    errors.push({
      path: 'cofirmPassword',
      message: 'Password must match',
    });
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
}

export function validateAccountUpdate(
  username: string,
  email: string,
  bio: string,
): Validator {
  const errors: Error = [];

  if (username) {
    if (username.trim() === '') {
      errors.push({
        path: 'username',
        message: 'Username must be provided',
      });
    }
  }

  if (email) {
    if (email.trim() === '') {
      errors.push({
        path: 'email',
        message: 'Email must be provided',
      });
    } else {
      const regEx =
        /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
      if (!email.match(regEx)) {
        errors.push({
          path: 'email',
          message: 'Email must be a valid email address',
        });
      }
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
}

export function validateEmail(email: string): Validator {
  const errors: Error = [];

  if (email.trim() === '') {
    errors.push({ path: 'email', message: 'Email must be provided' });
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.push({
        path: 'email',
        message: 'Email must be a valid email address',
      });
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
}
