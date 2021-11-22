import { gql } from 'apollo-server-express';

export default gql`
  scalar Upload

  interface UserError {
    message: String!
    path: String!
  }

  type DemoUserError implements UserError {
    message: String!
    path: String!
    demo: Boolean!
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

  type MissingContentError implements UserError {
    path: String!
    message: String!
    type: String!
  }

  union CreateUserError = UserInputError
  union LoginUserError = UserInputError | WrongCredetials
  union UpdatePasswordError = DemoUserError | WrongCredetials | UserInputError
  union UpdateAccountError = DemoUserError | UserInputError
  union RecoveryError = UserInputError
  union RecipeError = UserInputError
  union RatingError = MissingContentError | UserInputError

  type Session {
    id: ID!
    username: String!
    email: String
    bio: String
    profileImage: String
  }

  type Settings {
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
  type Comment {
    id: ID!
    content: String!
    author: String!
    username: String!
    profileImage: String!
  }
  type Recipe {
    id: ID!
    entityId: ID!
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
    authorImage: String!
    avgRating: Float
    userRating: Int
    ratingCount: Int
    favorited: Boolean
  }
  type Profile {
    username: String!
    bio: String
    profileImage: String!
    recipes: [Recipe]
  }

  union EntityItem = Recipe

  type EntitiesPaged {
    items: [EntityItem]
    endOfList: Boolean!
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

  type RecipePayload {
    recipe: Recipe
    errors: [RecipeError]
  }

  type UpdateRecipePayload {
    success: Boolean
    errors: [RecipeError]
  }

  type RatingPayload {
    success: Boolean
    errors: [RatingError]
  }

  type CommentPayload {
    success: Boolean
    comment: Comment
    errors: [UserInputError]
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }
  input RecipeInput {
    id: ID
    title: String
    summary: String
    directions: String
    ingredients: String
    prepTime: Int
    cookTime: Int
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
    getSettings: Settings
    getProfile(userId: ID!): Profile
    getRecipe(recipeId: ID!): Recipe
    getUserRecipes(
      userId: ID!
      publishedType: String!
      offset: Int!
      limit: Int!
    ): RecipePaged
    getComments(entityId: ID!): [Comment]

    searchRecipes(search: Search): RecipePaged

    getFavorites(offset: Int!, limit: Int!): EntitiesPaged
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

    createRecipe(recipeInput: RecipeInput): RecipePayload!
    deleteRecipe(recipeId: ID!): Boolean!
    updateRecipe(recipeInput: RecipeInput): UpdateRecipePayload!

    setRating(entityId: ID!, rating: Int!): RatingPayload!
    setFavorite(id: ID!, favorited: Boolean!): Boolean!

    createComment(source: ID!, parentId: ID, content: String!): CommentPayload
    deleteComment(commentId: ID!): CommentPayload
  }
`;
