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

export async function validateRegister(
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
): Promise<Validator> {
  const errors: Error = [];

  if (username.trim() === '') {
    errors.push({ path: 'username', message: 'Username must be provided' });
  } else if (username.trim().length < 4 || username.trim().length > 32) {
    errors.push({
      path: 'username',
      message: 'Username must be between 4 and 32 characters',
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

  if (password === '') {
    errors.push({
      path: 'password',
      message: 'Password must be provided',
    });
  } else if (password.length < 4) {
    errors.push({
      path: 'password',
      message: 'Password must have at least 4 characters',
    });
  }

  if (password !== confirmPassword) {
    errors.push({
      path: 'confirmPassword',
      message: 'Password must match',
    });
  }

  if (errors.length === 0) {
    const { errors: userErrors } = await checkExistingUser(username, email);
    errors.push(...userErrors);
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
  if (password === '') {
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

  if (oldPassword === '') {
    errors.push({
      path: 'oldPassword',
      message: 'Old password must be provided',
    });
  }

  if (newPassword === '') {
    errors.push({
      path: 'newPassword',
      message: 'New password must be provided',
    });
  } else if (newPassword.length < 4) {
    errors.push({
      path: 'newPassword',
      message: 'New password must have 4 characters',
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
  cookTime: number | undefined,
  prepTime: number | undefined,
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

    if (!cookTime && cookTime !== 0) {
      errors.push({
        path: 'cookTime',
        message: 'Cook time is required for a published recipe',
      });
    }

    if (!prepTime && prepTime !== 0) {
      errors.push({
        path: 'prepTime',
        message: 'Prep time is required for a published recipe',
      });
    }

    if (summary || summary === '') {
      if (summary.trim() === '') {
        errors.push({
          path: 'summary',
          message: 'Summary is required for a published recipe',
        });
      }
    }

    if (directions || directions === '') {
      if (directions.trim() === '') {
        errors.push({
          path: 'directions',
          message: 'Directions must be provided for a published recipe',
        });
      }
    }

    if (ingredients || ingredients === '') {
      if (ingredients.trim() === '') {
        errors.push({
          path: 'ingredients',
          message: 'Ingredients must be provided for a published recipe',
        });
      }
    }
  }

  return {
    errors,
    valid: errors.length === 0,
  };
}
