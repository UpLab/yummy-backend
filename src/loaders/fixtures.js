import UsersService from '../services/UsersService';
import { recipeListFactory } from '../__mocks__/recipe';
import RecipeService from '../services/RecipeService';

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
  defaultUsers.forEach((u) => {
    UsersService.createAccount(u);
  });

  const count = await RecipeService.getCollection().find({}).count();
  if (count === 0) {
    const recipes = recipeListFactory();
    await Promise.all(recipes.map((recipe) => RecipeService.createRecipe(recipe)));
  }
}
