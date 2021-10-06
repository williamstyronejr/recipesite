import { UserInputError } from 'apollo-server';
import bcrpty from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import { Op } from 'sequelize';
import {
  validateAccountUpdate,
  validateEmail,
  validateLogin,
  validatePasswordChange,
  validateRegister,
} from '../utils/validators';
import db from '../../models/index';
import checkAuth from '../utils/auth';
import { uploadImage } from './utils';

const { JWT_SECRET } = process.env;
const SALT_ROUNDS = 8;

function generateToken(user: any): string {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET || 'secret',
    { expiresIn: '1h' },
  );
}

/**
 * Check if a user exists with an username or email. Will throw a user input
 *  error is a user with the parameters already exists.
 * @param {String|undefined} username A username to check if its in use
 * @param {String|undefined} email A email to check if its in use
 * @return {Promise<Boolean>} Returns a promise to resolve if no user has this
 *  username and/or email.
 */
async function checkExistingUser(
  username: string | undefined,
  email: string | undefined,
): Promise<boolean> {
  const conditions: Array<any> = [];

  if (username) conditions.push({ username: { [Op.like]: username } });
  if (email) conditions.push({ email: { [Op.like]: email } });

  const matchingUsers = await db.models.User.findAll({
    where: {
      [Op.or]: conditions,
    },
  });

  if (matchingUsers.length > 0) {
    const errors: Record<string, unknown> = {};

    matchingUsers.forEach((user: any) => {
      if (user.dataValues.username === username) {
        errors.username = 'Username is already taken';
      }

      if (user.dataValues.email === email) {
        errors.email = 'Email is already in use';
      }
    });

    if (Object.keys(errors).length > 0)
      throw new UserInputError('Input error', { errors });
  }

  return true;
}

export default {
  Query: {
    async getProfile(
      __: any,
      { userId }: { userId: string },
    ): Promise<Record<string, unknown> | null> {
      const user = await db.models.User.findByPk(userId);

      if (!user) throw new UserInputError('User does not exist');

      const topRecipes = await db.models.Recipe.findAll({
        where: { author: userId },
        limit: 10,
        order: [['createdAt', 'DESC']],
      });

      return {
        username: user.username,
        bio: user.bio,
        profileImage: user.profileImage,
        recipes: topRecipes,
      };
    },
    async getSession(
      _: any,
      vars: any,
      context: any,
    ): Promise<Record<string, unknown> | null> {
      const sessionUser = checkAuth(context);
      const user = await db.models.User.findByPk(sessionUser.id);
      return user;
    },
  },
  Mutation: {
    async register(
      _: any,
      {
        registerInput: { username, email, password, confirmPassword },
      }: {
        registerInput: {
          username: string;
          email: string;
          password: string;
          confirmPassword: string;
        };
      },
    ): Promise<Record<string, unknown>> {
      const { errors, valid } = validateRegister(
        username,
        email,
        password,
        confirmPassword,
      );

      if (!valid) {
        console.log(errors);
        return {
          user: null,
          userErrors: errors,
        };
      }

      const hash = await bcrpty.hash(password, SALT_ROUNDS);
      const user = await db.models.User.create({
        username,
        email,
        hash,
        bio: '',
        profileImage: 'default.jpg',
      });
      const token = generateToken(user);

      return {
        user: { ...user.toJSON(), token },
      };
    },
    async login(
      _: any,
      { username, password }: { username: string; password: string },
    ): Promise<Record<string, unknown>> {
      const { errors, valid } = validateLogin(username, password);

      if (!valid) {
        return { userErrors: errors };
      }

      const user = await db.models.User.findOne({ where: { username } });

      if (!user) {
        return {
          userErrors: [
            {
              path: 'username',
              message: 'Invalid username or password',
              reason: 'Wrong Credetials',
            },
          ],
        };
      }

      const match = await bcrpty.compare(password, user.hash);
      if (!match) {
        return {
          userErrors: [
            {
              path: 'password',
              message: 'Invalid username or password',
              reason: 'Wrong Credetials',
            },
          ],
        };
      }

      const token = generateToken(user);

      return {
        user: {
          ...user.dataValues,
          token,
        },
      };
    },
    async recovery(_: any, { email }: { email: string }): Promise<boolean> {
      const existingUser = await checkExistingUser(undefined, email);
      if (!existingUser) return true;

      const { errors, valid } = validateEmail(email);
      if (!valid) throw new UserInputError('Input errors', { errors });

      // Send email to user
      return true;
    },
    async updatePassword(
      _: any,
      {
        oldPassword,
        newPassword,
        confirmPassword,
      }: { oldPassword: string; newPassword: string; confirmPassword: string },
      context: any,
    ): Promise<boolean> {
      const { errors, valid } = validatePasswordChange(
        oldPassword,
        newPassword,
        confirmPassword,
      );

      if (!valid) throw new UserInputError('Input errors', { errors });

      const sessionUser = checkAuth(context);
      const hash = await bcrpty.hash(newPassword, SALT_ROUNDS);
      const user = await db.models.User.findByPk(sessionUser.id);
      const match = await bcrpty.compare(oldPassword, user.hash);

      if (!match)
        throw new UserInputError('Wrong crendetials', {
          errors: { oldPassword: 'Incorrect password' },
        });

      const results = await db.models.User.update(
        { hash },
        {
          where: {
            id: sessionUser.id,
          },
        },
      );

      return results[0] > 0;
    },
    async updateAccount(
      _: any,
      {
        username,
        email,
        bio,
        profileImage,
        removeProfileImage,
      }: {
        username: string;
        email: string;
        bio: string;
        profileImage: any;
        removeProfileImage: boolean;
      },
      context: any,
    ): Promise<boolean> {
      const { errors, valid } = validateAccountUpdate(username, email, bio);

      if (!valid) throw new UserInputError('Input errors', { errors });
      const sessionUser = checkAuth(context);

      const fileName = await uploadImage(profileImage);

      await checkExistingUser(username, email);

      const params: {
        username?: string;
        email?: string;
        bio?: string;
        profileImage?: string;
      } = {};
      if (username) params.username = username;
      if (email) params.email = email;
      if (bio) params.bio = bio;
      if (fileName) params.profileImage = fileName;
      if (removeProfileImage) params.profileImage = 'default.jpg';

      await db.models.User.update(params, {
        where: {
          id: sessionUser.id,
        },
      });

      return true;
    },
    async deleteAccount(_: any, vars: any, context: any): Promise<boolean> {
      const sessionUser = checkAuth(context);

      const rowsDestroyed = await db.models.User.destroy({
        where: { id: sessionUser.id },
      });

      return rowsDestroyed > 0;
    },
    async subscribeToLetter(
      _: any,
      { email }: { email: string },
    ): Promise<boolean> {
      const { errors, valid } = validateEmail(email);
      if (!valid) throw new UserInputError('Input errors', { errors });

      // Add user to mail list

      return true;
    },
  },
};
