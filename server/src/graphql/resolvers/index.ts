import { GraphQLUpload } from 'graphql-upload';
import userResolver from './user';
import recipeResolver from './recipe';
import commentResolver from './comment';
import bookmarkResolver from './bookmark';
import entityResolver from './entity';

export default {
  Upload: GraphQLUpload,
  CreateUserError: {
    __resolveType: (obj: Record<string, unknown>) => {
      return 'UserInputError';
    },
  },
  LoginUserError: {
    __resolveType: (obj: Record<string, unknown>) => {
      if (obj.reason) return 'WrongCredetials';
      return 'UserInputError';
    },
  },
  UpdatePasswordError: {
    __resolveType: (obj: Record<string, unknown>) => {
      if (obj.reason) return 'WrongCredetials';
      return 'UserInputError';
    },
  },
  UpdateAccountError: {
    __resolveType: (obj: Record<string, unknown>) => {
      return 'UserInputError';
    },
  },
  RecoveryError: {
    __resolveType: (obj: Record<string, unknown>) => {
      return 'UserInputError';
    },
  },
  RecipeError: {
    __resolveType: (obj: Record<string, unknown>) => {
      return 'UserInputError';
    },
  },
  RatingError: {
    __resolveType: (obj: Record<string, unknown>) => {
      if (obj.type) return 'MissingContentError';
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
    ...entityResolver.Mutation,
  },
};
