import MockDataService from '../services/MockDataService';

export default function ExpressLoader(app) {
  app.get('/', (req, res) => {
    res.send(`Hello World! ${1_000_000_000_000}`);
  });

  app.get('/recipes', (req, res) => {
    res.json(MockDataService.getRecipes());
  });

  app.get('/recipes/:id', (req, res) => {
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
}
