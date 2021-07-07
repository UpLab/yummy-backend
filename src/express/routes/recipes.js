import RecipeService from '../../services/RecipeService';
import logger from '../../utils/logger';
import authMiddleware from '../middlewares/auth';

const createContext = (req) => {
  const { jwtUser } = req;
  return {
    userId: jwtUser._id,
  };
};

const wrapPromiseHandler =
  (handler) =>
  async (...args) => {
    const [, res] = args;
    try {
      await handler(...args);
    } catch (error) {
      console.error(error);
      logger.error(error);
      res.status(500);
      res.json({
        error: 'Internal server error',
      });
    }
  };

const findRecipeMiddleware = wrapPromiseHandler(async (req, res, next) => {
  const recipe = await RecipeService.findRecipeById(req.params.recipeId, createContext(req));

  if (recipe) {
    req.recipe = recipe;
    return next();
  }
  res.status(404);
  res.json({
    error: 'Recipe not found',
  });
  return null;
});

const canViewRecipeMiddleware = (req, res, next) => {
  const canViewRecipe = RecipeService.canViewRecipe(req.recipe, req.jwtUser._id);
  if (!canViewRecipe) {
    res.status(403);
    res.json({
      error: 'Access denied',
    });
  } else {
    next();
  }
};

class RecipeRoutesController {
  getUserRecipes = async (req, res) => {
    const recipes = await RecipeService.getUserRecipes({}, createContext(req));
    res.json(recipes);
  };

  getRecipeById = async (req, res) => {
    const { recipe } = req;
    res.json(recipe);
  };

  updateRecipeById = async (req, res) => {
    const {
      params: { recipeId },
      body: data,
    } = req;

    await RecipeService.updateRecipe(recipeId, data, createContext(req));

    const updatedRecipe = await RecipeService.findRecipeById(recipeId, createContext(req));
    res.json(updatedRecipe);
  };

  createRecipe = async (req, res) => {
    const { body: recipe } = req;

    await RecipeService.createRecipe(recipe, createContext(req));

    res.json({ status: 'ok' });
  };

  resetRecipes = async (req, res) => {
    await RecipeService.resetRecipes();

    res.json({ status: 'ok' });
  };
}

const recipeRoutesController = new RecipeRoutesController();

export default function addRecipeRoutes(app) {
  app.get('/api/recipes', authMiddleware, wrapPromiseHandler(recipeRoutesController.getUserRecipes));

  app.get(
    '/api/recipes/:recipeId',
    authMiddleware,
    findRecipeMiddleware,
    canViewRecipeMiddleware,
    wrapPromiseHandler(recipeRoutesController.getRecipeById),
  );

  app.post('/api/recipes/create', authMiddleware, wrapPromiseHandler(recipeRoutesController.createRecipe));

  // TODO: remove reset method
  app.post('/api/recipes/reset', authMiddleware, wrapPromiseHandler(recipeRoutesController.resetRecipes));

  app.post(
    '/api/recipes/:recipeId',
    authMiddleware,
    findRecipeMiddleware,
    canViewRecipeMiddleware,
    wrapPromiseHandler(recipeRoutesController.updateRecipeById),
  );
}
