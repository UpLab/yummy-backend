import RecipeService from '../../services/RecipeService';
import authMiddleware from '../middlewares/auth';

export default function addRecipeRoutes(app) {
  app.get('/api/recipes', authMiddleware, async (req, res) => {
    const recipes = await RecipeService.getRecipes();
    res.json(recipes);
  });

  app.get('/api/recipes/:id', authMiddleware, async (req, res) => {
    const { params } = req;
    const recipe = await RecipeService.findRecipeById(params.id);

    if (recipe) {
      res.json(await RecipeService.findRecipeById(params.id));
    } else {
      res.status(500);
      res.json({
        error: {
          message: 'Recipe not found',
        },
      });
    }
  });

  app.post('/api/recipes/create', authMiddleware, async (req, res) => {
    const { body: recipe } = req;

    await RecipeService.createRecipe(recipe);

    res.json({ status: 'ok' });
  });

  app.post('/api/recipes/reset', authMiddleware, async (req, res) => {
    await RecipeService.resetRecipes();

    res.json({ status: 'ok' });
  });
}
