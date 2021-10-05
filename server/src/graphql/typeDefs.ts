import { gql } from 'apollo-server-express';

export default gql`
  scalar Upload

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
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    recovery(email: String!): Boolean!
    subscribeToLetter(email: String!): Boolean!

    updatePassword(
      oldPassword: String!
      newPassword: String!
      confirmPassword: String!
    ): Boolean!
    updateAccount(
      username: String
      email: String
      bio: String
      profileImage: Upload
      removeProfileImage: Boolean
    ): Boolean!
    deleteAccount: Boolean!

    createRecipe(recipeInput: RecipeInput): Recipe!
    deleteRecipe(recipeId: ID!): Boolean!
    updateRecipe(recipeInput: RecipeInput): Boolean!
    updateBookmark(recipeId: ID!, bookmarking: Boolean!): Boolean!
  }
`;
