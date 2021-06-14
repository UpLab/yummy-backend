import MockDataService from '../../services/MockDataService';
import authMiddleware from '../middlewares/auth';

export default function addRecipeRoutes(app) {
  app.get('/api/recipes', authMiddleware, (req, res) => {
    res.json(MockDataService.getRecipes());
  });

  app.get('/api/recipes/:id', authMiddleware, (req, res) => {
    const { params } = req;
    const recipe = MockDataService.findRecipeById(params.id);

    if (recipe) {
      res.json(MockDataService.findRecipeById(params.id));
    } else {
      res.status(500);
      res.json({
        error: {
          message: 'Recipe not found',
        },
      });
    }
  });

  app.post('/api/recipes/create', authMiddleware, (req, res) => {
    const { body: recipe } = req;

    MockDataService.createRecipe(recipe);

    res.json({ status: 'ok' });
  });

  app.post('/api/recipes/reset', authMiddleware, (req, res) => {
    MockDataService.resetRecipes();

    res.json({ status: 'ok' });
  });
}
