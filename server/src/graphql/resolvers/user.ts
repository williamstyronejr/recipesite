import { UserInputError } from 'apollo-server';
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

const { JWT_SECRET } = process.env;
const SALT_ROUNDS = 8;

function generateToken(user: any): string {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET || 'secret',
    { expiresIn: '1h' },
  );
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

      return {
        user: {
          ...user.dataValues,
          token,
        },
      };
    },
    async recovery(
      _: any,
      { email }: { email: string },
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
      context: any,
    ): Promise<Record<string, unknown>> {
      const { errors, valid } = validatePasswordChange(
        oldPassword,
        newPassword,
        confirmPassword,
      );

      if (!valid) {
        return {
          success: false,
          updateErrors: errors,
        };
      }

      const sessionUser = checkAuth(context);
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
        },
      );

      return { success: results[0] > 0 };
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
    ): Promise<Record<string, unknown>> {
      const { errors, valid } = await validateAccountUpdate(
        username,
        email,
        bio,
      );

      if (!valid) {
        return {
          success: false,
          updateErrors: errors,
        };
      }

      const sessionUser = checkAuth(context);
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
