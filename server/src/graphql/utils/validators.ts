interface Validator {
  errors: Record<string, unknown>;
  valid: boolean;
}

export function validateRegister(
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
): Validator {
  const errors: Record<string, unknown> = {};

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
    errors.confirmPassword = 'Password must match';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
}

export function validateLogin(username: string, password: string): Validator {
  const errors: Record<string, unknown> = {};

  if (username.trim() === '') {
    errors.username = 'Username must be provided';
  }
  if (password.trim() === '') {
    errors.password = 'Password must be provided';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
}

export function validatePasswordChange(
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
): Validator {
  const errors: Record<string, unknown> = {};

  if (oldPassword.trim() === '') {
    errors.oldPassword = 'Old password must be provided';
  }

  if (newPassword.trim() === '') {
    errors.newPassword = 'New password must be provided';
  }

  if (newPassword !== confirmPassword) {
    errors.cofirmPassword = 'Password must match';
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
  const errors: Record<string, unknown> = {};

  if (username) {
    if (username.trim() === '') {
      errors.username = 'Username must be provided';
    }
  }

  if (email) {
    if (email.trim() === '') {
      errors.email = 'Email must be provided';
    } else {
      const regEx =
        /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
      if (!email.match(regEx)) {
        errors.email = 'Email must be a valid email address';
      }
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
}

export function validateEmail(email: string): Validator {
  const errors: { email?: string } = {};

  if (email.trim() === '') {
    errors.email = 'Email must be provided';
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address';
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
}
