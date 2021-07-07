import UsersService from '../services/UsersService';
// import { recipeListFactory } from '../__mocks__/recipe';
// import RecipeService from '../services/RecipeService';
import logger from '../utils/logger';

const defaultUsers = [
  {
    email: 'ihor@uplab.io',
    password: '1234',
  },
  {
    email: 'john@uplab.io',
    password: '1234',
  },
];

export default async function fixtures() {
  defaultUsers.forEach(async (u) => {
    try {
      await UsersService.createAccount(u);
    } catch (error) {
      if (error.message.includes('already registered')) return;
      logger.error(error);
      throw error;
    }
  });

  // const count = await RecipeService.getCollection().find({}).count();
  // if (count === 0) {
  //   const recipes = recipeListFactory();
  //   await Promise.all(recipes.map((recipe) => RecipeService.createRecipe(recipe)));
  // }
}
