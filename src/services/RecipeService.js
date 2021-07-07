import mongo from 'mongodb';
import MongoClientProvider from './MongoClientProvider';

class RecipeService {
  collectionName = 'recipes';

  canViewRecipe = (recipe, userId) => {
    const authorObjectId = new mongo.ObjectId(recipe.authorId);
    const userObjectId = new mongo.ObjectId(userId);

    if (authorObjectId.equals(userObjectId)) return true;
    return false;
  };

  getCollection() {
    return MongoClientProvider.db.collection(this.collectionName);
  }

  async getUserRecipes(query = {}, context) {
    return this.getCollection()
      .find({ authorId: new mongo.ObjectId(context.userId), ...query })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async findRecipeById(_id) {
    const objectId = new mongo.ObjectID(_id);
    return this.getCollection().findOne({ _id: objectId });
  }

  async createRecipe(recipe, context) {
    // TODO: validate
    const doc = {
      ...recipe,
      authorId: new mongo.ObjectId(context.userId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.getCollection().insert(doc);
    return recipe;
  }

  async updateRecipe(_id, data) {
    // TODO: validate
    await this.getCollection().updateOne(
      { _id: new mongo.ObjectID(_id) },
      { $set: { ...data, updatedAt: new Date() } },
    );
  }

  async resetRecipes() {
    await this.getCollection().remove({});
  }
}

export default new RecipeService();
