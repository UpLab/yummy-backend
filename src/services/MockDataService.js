import { recipeListFactory } from '../__mocks__/recipe';

class MockDataService {
  constructor() {
    this.recipeList = recipeListFactory();
  }

  getRecipes() {
    return this.recipeList;
  }

  findRecipeById(_id) {
    return this.recipeList.find((recipe) => recipe._id === _id);
  }

  createRecipe(recipe) {
    this.recipeList.unshift(recipe);
    return recipe;
  }

  resetRecipes() {
    this.recipeList = [];
  }
}

export default new MockDataService();
