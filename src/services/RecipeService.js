import mongo from 'mongodb';
import MongoClientProvider from './MongoClientProvider';

class MockDataService {
  collectionName = 'recipes';

  getCollection() {
    return MongoClientProvider.db.collection(this.collectionName);
  }

  async getRecipes() {
    return this.getCollection().find({}).sort({ createdAt: -1 }).toArray();
  }

  async findRecipeById(_id) {
    const objectId = new mongo.ObjectID(_id);
    return this.getCollection().findOne({ _id: objectId });
  }

  async createRecipe(recipe) {
    // TODO: validate?
    const doc = { ...recipe, createdAt: new Date() };
    await this.getCollection().insert(doc);
    return recipe;
  }

  async resetRecipes() {
    await this.getCollection().remove({});
  }
}

export default new MockDataService();
