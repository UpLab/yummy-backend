import { gql } from 'apollo-server-express';
import RecipeService from '../../services/RecipeService';
import UsersService from '../../services/UsersService';
// import logger from '../../utils/logger';

// Construct a schema, using GraphQL schema language
export const typeDefs = gql`
  type Recipe {
    _id: ID!
    name: String!
    featuredImage: String!
    images: [String]!
    cookTimeMinutes: Float!
    servings: Float!
    authorId: ID!
    author: User!
    notes: String!
    instructions: [String]!
    ingredients: [RecipeIngredient]!
    createdAt: Float!
    updatedAt: Float!
  }

  type RecipeIngredient {
    value: Float!
    title: String!
    unit: RecipeIngredientUnit!
  }

  enum RecipeIngredientUnit {
    pc
    kg
    g
    ml
    l
    teaspoon
    tablespoon
    cup
    slice
  }

  extend type Query {
    userRecipes: [Recipe]! @auth
    recipe(recipeId: ID!): Recipe! @auth
  }

  input RecipeCreateInput {
    name: String!
    featuredImage: String!
    images: [String]!
    cookTimeMinutes: Float!
    servings: Float!
    notes: String!
    instructions: [String]!
    ingredients: [RecipeIngredientInput]!
  }

  input RecipeUpdateInput {
    name: String
    featuredImage: String
    images: [String]
    cookTimeMinutes: Float
    servings: Float
    notes: String
    instructions: [String]
    ingredients: [RecipeIngredientInput]
  }

  input RecipeIngredientInput {
    value: Float!
    title: String!
    unit: RecipeIngredientUnit!
  }

  extend type Mutation {
    createRecipe(input: RecipeCreateInput!): Recipe! @auth
    updateRecipe(recipeId: ID!, input: RecipeUpdateInput!): Recipe! @auth
    deleteRecipe(recipeId: ID!): Boolean @auth
  }
`;

async function safeFindRecipe(recipeId, userId) {
  const recipe = await RecipeService.findRecipeById(recipeId, { userId });
  if (!recipe) {
    throw new Error('Recipe not found');
  }
  const canViewRecipe = RecipeService.canViewRecipe(recipe, userId);
  if (!canViewRecipe) {
    throw new Error('Access denied');
  }
  return recipe;
}

// Provide resolver functions for your schema fields
export const resolvers = {
  Query: {
    userRecipes: async (root, params, context) => {
      const { userId } = context;

      const recipes = await RecipeService.getUserRecipes({}, { userId });
      return recipes;
    },
    recipe: async (root, { recipeId }, { userId }) => {
      const recipe = await safeFindRecipe(recipeId, userId);
      return recipe;
    },
  },
  Mutation: {
    createRecipe: async (root, { input }, { userId }) => {
      const recipe = await RecipeService.createRecipe(input, { userId });
      return recipe;
    },
    updateRecipe: async (root, { recipeId, input }, { userId }) => {
      await safeFindRecipe(recipeId, userId);

      await RecipeService.updateRecipe(recipeId, input, { userId });

      const updatedRecipe = await RecipeService.findRecipeById(recipeId, { userId });

      return updatedRecipe;
    },
    deleteRecipe: async (root, { recipeId }, { userId }) => {
      await safeFindRecipe(recipeId, userId);
      await RecipeService.deleteRecipeById(recipeId);
      return true;
    },
  },
  Recipe: {
    author: (root) => UsersService.findById(root.authorId),
  },
};
