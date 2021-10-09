import { GraphQLUpload } from 'graphql-upload';
import userResolver from './user';
import recipeResolver from './recipe';
import commentResolver from './comment';
import bookmarkResolver from './bookmark';

export default {
  Upload: GraphQLUpload,
  CreateUserError: {
    __resolveType: (obj: any) => {
      return 'UserInputError';
    },
  },
  LoginUserError: {
    __resolveType: (obj: any) => {
      if (obj.reason) return 'WrongCredetials';
      return 'UserInputError';
    },
  },
  UpdatePasswordError: {
    __resolveType: (obj: any) => {
      if (obj.reason) return 'WrongCredetials';
      return 'UserInputError';
    },
  },
  UpdateAccountError: {
    __resolveType: (obj: any) => {
      return 'UserInputError';
    },
  },
  RecoveryError: {
    __resolveType: (obj: any) => {
      return 'UserInputError';
    },
  },
  Query: {
    ...userResolver.Query,
    ...recipeResolver.Query,
    ...commentResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...recipeResolver.Mutation,
    ...commentResolver.Mutation,
    ...bookmarkResolver.Mutation,
  },
};
