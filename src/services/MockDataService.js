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
}

export default new MockDataService();
