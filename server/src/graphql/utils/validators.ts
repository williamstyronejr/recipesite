import db from '../../models/index';
import { Op } from 'sequelize';

type Error = Array<{ path: string; message: string }>;

interface Validator {
  errors: Error;
  valid: boolean;
}

export async function checkExistingUser(
  username: string | undefined,
  email: string | undefined,
): Promise<Validator> {
  const errors: Error = [];
  const conditions: Array<Record<string, unknown>> = [];

  if (username) conditions.push({ username: { [Op.like]: username } });
  if (email) conditions.push({ email: { [Op.like]: email } });

  if (conditions.length === 0) return { valid: true, errors: [] };

  const matchingUsers = await db.models.User.findAll({
    where: {
      [Op.or]: conditions,
    },
  });

  if (matchingUsers.length > 0) {
    matchingUsers.forEach((user: any) => {
      if (user.dataValues.username === username) {
        errors.push({
          path: 'username',
          message: 'Username is already taken',
        });
      }

      if (user.dataValues.email === email) {
        errors.push({
          path: 'email',
          message: 'Email is already in use',
        });
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
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
      path: 'confirmPassword',
      message: 'Password must match',
    });
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
}

export async function validateAccountUpdate(
  username: string,
  email: string,
  bio: string,
): Promise<Validator> {
  const errors: Error = [];

  if (username !== undefined) {
    if (username.trim() === '') {
      errors.push({
        path: 'username',
        message: 'Username must be provided',
      });
    }
  }

  if (email !== undefined) {
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

  const { errors: userErrors } = await checkExistingUser(username, email);
  if (userErrors.length > 0) errors.push(...userErrors);

  return {
    valid: Object.keys(errors).length < 1,
    errors,
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

export function validateRecipe(
  title: string | undefined,
  summary: string | undefined,
  directions: string | undefined,
  ingredients: string | undefined,
  cookTime: string | undefined,
  prepTime: string | undefined,
  published: boolean,
): Validator {
  const errors: Error = [];

  // If published all fields are required
  if (published) {
    if (title || title === '') {
      if (title.trim() === '') {
        errors.push({
          path: 'title',
          message: 'Title is required for a published recipe',
        });
      }
    }
  }

  return {
    errors,
    valid: errors.length === 0,
  };
}
