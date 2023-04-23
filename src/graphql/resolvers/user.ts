import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError } from 'graphql';

const UserInputError = (msg: string, exts?: Record<string, any>) =>
  new GraphQLError(msg, {
    extensions: {
      code: ApolloServerErrorCode.BAD_USER_INPUT,
      ...exts,
    },
  });

import bcrpty from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  validateAccountUpdate,
  validateEmail,
  validateLogin,
  validatePasswordChange,
  validateRegister,
  checkExistingUser,
} from '../utils/validators';
import db from '../../models/index';
import checkAuth from '../utils/auth';
import { uploadImage } from './utils';
import { setTokenCookie } from '@/apollo/cookies';

const { JWT_SECRET } = process.env;
const SALT_ROUNDS = 8;
const COOKIE_OPTION =
  process.env.NODE_ENV === 'development'
    ? {}
    : { httpOnly: true, secure: true };

function generateToken(user: any): string {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET || 'secret',
    { expiresIn: '1h' }
  );
}

export default {
  Query: {
    async getProfile(
      __: any,
      { userId }: { userId: string }
    ): Promise<Record<string, unknown> | null> {
      try {
        const user = await db.models.User.findByPk(userId);

        if (!user) throw UserInputError('User does not exist');

        const topRecipes = await db.models.Recipe.findAll({
          where: { author: userId, published: true },
          limit: 10,
          order: [['createdAt', 'DESC']],
        });

        return {
          username: user.username,
          bio: user.bio,
          profileImage: user.profileImage,
          recipes: topRecipes,
        };
      } catch (err: any) {
        // Sequlize error, invalid id type (non integer)
        if (err.original && err.original.code === '22P02') {
          // logger.warn(`User with id, ${userId}, could not be found.`);
        }

        return null;
      }
    },
    async getSession(
      _: any,
      vars: any,
      context: any
    ): Promise<Record<string, unknown> | null> {
      const sessionUser = checkAuth(context);

      try {
        const user = await db.models.User.findByPk(sessionUser.id);

        return user;
      } catch (err) {
        return null;
      }
    },
    async getSettings(
      _: any,
      vars: any,
      context: any
    ): Promise<Record<string, unknown> | null> {
      try {
        const sessionUser = checkAuth(context);
        const user = await db.models.User.findByPk(sessionUser.id);
        if (!user) return null;

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          bio: user.bio,
          profileImage: user.profileImage,
        };
      } catch (err) {
        return null;
      }
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
      context: any
    ): Promise<Record<string, unknown>> {
      const { errors, valid } = await validateRegister(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        return {
          user: null,
          userErrors: errors,
        };
      }

      try {
        const hash = await bcrpty.hash(password, SALT_ROUNDS);

        const user = await db.models.User.create({
          username,
          email,
          hash,
          bio: '',
          profileImage: 'default.jpg',
        });
        const token = generateToken(user);

        context.res.cookie('token', token, COOKIE_OPTION);

        return {
          user: { ...user.toJSON(), token },
        };
      } catch (err: any) {
        if (err.name && err.name === 'SequelizeUniqueConstraintError') {
          const errors: any = [];

          if (err.fields) {
            Object.keys(err.fields).forEach((field) => {
              if (field === 'username') {
                errors.push({
                  path: 'username',
                  message: 'Username is already in use',
                });
              } else if (field === 'email') {
                errors.push({
                  path: 'email',
                  message: 'Email is already in use',
                });
              }
            });
          }

          if (errors.length > 0) return { userErrors: errors };
        }

        return {
          userErrors: [
            {
              path: 'general',
              message: 'Server error occurred, please try again.',
            },
          ],
        };
      }
    },
    async login(
      _: any,
      { username, password }: { username: string; password: string },
      context: any
    ): Promise<Record<string, unknown>> {
      const { errors, valid } = validateLogin(username, password);

      if (!valid) {
        return { userErrors: errors };
      }

      try {
        const user = await db.models.User.findOne({ where: { username } });

        if (!user) {
          return {
            userErrors: [
              {
                path: 'general',
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
                path: 'general',
                message: 'Invalid username or password',
                reason: 'Wrong Credetials',
              },
            ],
          };
        }

        const token = generateToken(user);
        setTokenCookie(context.res, token);

        return {
          user: {
            ...user.dataValues,
            token,
          },
        };
      } catch (err) {
        return {
          userErrors: [
            {
              path: 'general',
              message: 'An error has occurred, please try again.',
            },
          ],
        };
      }
    },
    async recovery(
      _: any,
      { email }: { email: string }
    ): Promise<Record<string, unknown>> {
      const { valid: userExists } = await checkExistingUser(undefined, email);
      if (!userExists) return { success: true };

      const { errors, valid } = validateEmail(email);
      if (!valid) {
        return {
          errors,
        };
      }

      // Send email to user
      return { success: true };
    },
    async updatePassword(
      _: any,
      {
        oldPassword,
        newPassword,
        confirmPassword,
      }: { oldPassword: string; newPassword: string; confirmPassword: string },
      context: any
    ): Promise<Record<string, unknown>> {
      const { errors, valid } = validatePasswordChange(
        oldPassword,
        newPassword,
        confirmPassword
      );

      if (!valid) {
        return {
          success: false,
          updateErrors: errors,
        };
      }

      try {
        const sessionUser = checkAuth(context);
        if (sessionUser.username === 'guest')
          return {
            updateErrors: [
              {
                path: 'general',
                message: 'Password for guest account can not be updated.',
                demo: true,
              },
            ],
          };

        const hash = await bcrpty.hash(newPassword, SALT_ROUNDS);
        const user = await db.models.User.findByPk(sessionUser.id);
        const match = await bcrpty.compare(oldPassword, user.hash);

        if (!match) {
          return {
            updateErrors: [
              {
                path: 'oldPassword',
                message: 'Incorrect password',
                reason: 'Wrong Credetials',
              },
            ],
          };
        }

        const results = await db.models.User.update(
          { hash },
          {
            where: {
              id: sessionUser.id,
            },
          }
        );

        return { success: results[0] > 0 };
      } catch (err) {
        return {
          success: false,
          updateErrors: [
            {
              path: 'general',
              message: 'An error has occurred, please try again.',
            },
          ],
        };
      }
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
      context: any
    ): Promise<Record<string, unknown>> {
      const sessionUser = checkAuth(context);
      const { errors, valid } = await validateAccountUpdate(
        username,
        email,
        bio
      );

      if (!valid) {
        return {
          success: false,
          updateErrors: errors,
        };
      }

      if (sessionUser.username === 'guest')
        return {
          updateErrors: [
            {
              path: 'general',
              message: 'Guest user can not update their account settings.',
              demo: true,
            },
          ],
        };

      try {
        const fileName = await uploadImage(profileImage);

        const params: {
          username?: string;
          email?: string;
          bio?: string;
          profileImage?: string;
        } = {};
        if (username) params.username = username;
        if (email) params.email = email;
        if (bio || bio === '') params.bio = bio;
        if (fileName) params.profileImage = fileName;
        if (removeProfileImage) params.profileImage = 'default.jpg';

        await db.models.User.update(params, {
          where: {
            id: sessionUser.id,
          },
        });

        return {
          success: true,
        };
      } catch (err: any) {
        if (err.name && err.name === 'SequelizeUniqueConstraintError') {
          const errors: any = [];

          if (err.fields) {
            Object.keys(err.fields).forEach((field) => {
              if (field === 'username') {
                errors.push({
                  path: 'username',
                  message: 'Username is already in use',
                });
              } else if (field === 'email') {
                errors.push({
                  path: 'email',
                  message: 'Email is already in use',
                });
              }
            });
          }

          if (errors.length > 0) return { userErrors: errors };
        }

        return {
          updateErrors: [
            {
              path: 'general',
              message: 'Server error occurred, please try again',
            },
          ],
        };
      }
    },
    async deleteAccount(_: any, vars: any, context: any): Promise<boolean> {
      const sessionUser = checkAuth(context);

      if (sessionUser.username === 'guest') return false;

      try {
        const rowsDestroyed = await db.models.User.destroy({
          where: { id: sessionUser.id },
        });

        context.res.clearCookie('token');
        return rowsDestroyed > 0;
      } catch (err) {
        return false;
      }
    },
    async subscribeToLetter(
      _: any,
      { email }: { email: string }
    ): Promise<boolean> {
      const { errors, valid } = validateEmail(email);
      if (!valid) throw UserInputError('Input errors', { errors });

      // Add user to mail list

      return true;
    },
  },
};
