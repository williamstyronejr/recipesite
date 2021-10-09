import { gql } from 'apollo-server-express';

export default gql`
  scalar Upload

  interface UserError {
    message: String!
    path: String!
  }

  type UserInputError implements UserError {
    message: String!
    path: String!
  }

  type WrongCredetials implements UserError {
    path: String!
    message: String!
    reason: String!
  }

  union CreateUserError = UserInputError
  union LoginUserError = UserInputError | WrongCredetials
  union UpdatePasswordError = WrongCredetials | UserInputError
  union UpdateAccountError = UserInputError
  union RecoveryError = UserInputError

  type Session {
    id: ID!
    username: String!
    email: String
    bio: String
    profileImage: String
  }
  type User {
    id: ID!
    email: String!
    username: String!
    bio: String
    profileImage: String
    token: String!
  }
  type Recipe {
    id: ID!
    title: String!
    summary: String!
    directions: String!
    ingredients: String!
    published: Boolean!
    prepTime: Int!
    cookTime: Int!
    mainImage: String!
    authorName: String!
    author: ID!
  }
  type Comment {
    id: ID!
    content: String!
    author: String!
    source: String!
  }
  type Profile {
    username: String!
    bio: String
    profileImage: String!
    recipes: [Recipe]
  }
  type RecipePaged {
    recipes: [Recipe]!
    endOfList: Boolean!
  }

  type RegisterPayload {
    user: User
    userErrors: [CreateUserError]
  }

  type LoginPayload {
    user: User
    userErrors: [LoginUserError]
  }

  type PasswordUpdatePayload {
    success: Boolean
    updateErrors: [UpdatePasswordError]
  }

  type AccountUpdatePayload {
    success: Boolean
    updateErrors: [UpdateAccountError]
  }

  type RecoveryPayload {
    success: Boolean
    errors: [RecoveryError]
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }
  input RecipeInput {
    id: ID
    title: String!
    summary: String!
    directions: String!
    ingredients: String!
    prepTime: Int!
    cookTime: Int!
    published: Boolean!
    mainImage: Upload
    removeImage: Boolean
  }
  input Search {
    q: String
    order: String
    author: String
    offset: Int!
    limit: Int!
  }

  type Query {
    getSession: Session
    getProfile(userId: ID!): Profile
    getRecipe(recipeId: ID!): Recipe
    getUserRecipes(userId: ID!, publishedType: String!): [Recipe]
    getCommentsByRecipe(author: ID!): [Comment]

    searchRecipes(search: Search): RecipePaged
  }

  type Mutation {
    register(registerInput: RegisterInput): RegisterPayload!
    login(username: String!, password: String!): LoginPayload!
    recovery(email: String!): RecoveryPayload!
    subscribeToLetter(email: String!): Boolean!

    updatePassword(
      oldPassword: String!
      newPassword: String!
      confirmPassword: String!
    ): PasswordUpdatePayload!
    updateAccount(
      username: String
      email: String
      bio: String
      profileImage: Upload
      removeProfileImage: Boolean
    ): AccountUpdatePayload!
    deleteAccount: Boolean!

    createRecipe(recipeInput: RecipeInput): Recipe!
    deleteRecipe(recipeId: ID!): Boolean!
    updateRecipe(recipeInput: RecipeInput): Boolean!
    updateBookmark(recipeId: ID!, bookmarking: Boolean!): Boolean!
  }
`;
