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
