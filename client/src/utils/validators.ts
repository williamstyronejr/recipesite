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

export function validatePasswordUpdate(
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
): Errors {
  const errors: Errors = {};

  if (oldPassword.trim() === '') {
    errors.oldPassword = 'Old password must be provided';
  }

  if (newPassword.trim() === '') {
    errors.newPassword = 'New password must be provided';
  } else if (newPassword.trim().length < 4) {
    errors.newPassword = 'Password must be at least 4 characters.';
  }

  if (confirmPassword !== newPassword) {
    errors.confirmPassword = 'Passwords must match';
  }

  return errors;
}

export function validateAccountUpdate(username: string, email: string): Errors {
  const errors: Errors = {};

  if (username !== undefined) {
    if (username.trim() === '') {
      errors.username = 'Username must be provided';
    } else if (username.trim().length < 4) {
      errors.username = 'Username must be at least 4 characters';
    }
  }

  if (email !== undefined) {
    if (email.trim() === '') {
      errors.email = 'Email must be provided';
    } else {
      const regEx =
        /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

      if (!email.match(regEx))
        errors.email = 'Email must be a valid email address';
    }
  }

  return errors;
}

export function validateRecipe(
  title: string,
  prepTime: string,
  cookTime: string,
  summary: string,
  directions: string,
  ingredients: string,
  published: boolean,
): Errors {
  const errors: Errors = {};

  // All fields required when published
  if (published) {
    if (title.trim() === '') {
      errors.title = 'Title must be provided for published recipe';
    }

    if (prepTime.trim() === '') {
      errors.prepTime = 'Prep time must be provided for a published recipe';
    } else if (Number.isNaN(Number.parseInt(cookTime, 10))) {
      errors.prepTime = 'Prep time must be a number';
    }

    if (cookTime.trim() === '') {
      errors.cookTime = 'Cook time must be provided for a published recipe';
    } else if (Number.isNaN(Number.parseInt(cookTime, 10))) {
      errors.cookTime = 'Cook time must be a number';
    }

    if (summary.trim() === '') {
      errors.summary = 'Summary must be provided for a published recipe';
    }

    if (directions.trim() === '') {
      errors.directions = 'Directions must be provided for a published recipe';
    }

    if (ingredients.trim() === '') {
      errors.ingredients =
        'Ingredients must be provided for a published recipe';
    }
  }

  return errors;
}
