import { GraphQLUpload } from 'graphql-upload';
import userResolver from './user';
import recipeResolver from './recipe';
import commentResolver from './comment';
import bookmarkResolver from './bookmark';
import favoriteResolver from './favorite';
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
      if (obj.demo) return 'DemoUserError';
      return 'UserInputError';
    },
  },
  UpdateAccountError: {
    __resolveType: (obj: Record<string, unknown>) => {
      if (obj.demo) return 'DemoUserError';
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

  EntityItem: {
    __resolveType: (obj: Record<string, unknown>) => {
      if (obj.ingredients) return 'Recipe';
    },
  },
  Query: {
    ...userResolver.Query,
    ...recipeResolver.Query,
    ...commentResolver.Query,
    ...favoriteResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...recipeResolver.Mutation,
    ...commentResolver.Mutation,
    ...bookmarkResolver.Mutation,
    ...entityResolver.Mutation,
    ...favoriteResolver.Mutation,
  },
};
