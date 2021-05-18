import bodyParser from 'body-parser';
import MockDataService from '../services/MockDataService';

export default function ExpressLoader(app) {
  app.use(bodyParser.json());

  app.get('/', (req, res) => {
    res.send(`Hello World! ${1_000_000_000_000}`);
  });

  app.get('/api/recipes', (req, res) => {
    res.json(MockDataService.getRecipes());
  });

  app.get('/api/recipes/:id', (req, res) => {
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

  app.post('/api/recipes/create', (req, res) => {
    const { body: recipe } = req;

    MockDataService.createRecipe(recipe);

    res.json({ status: 'ok' });
  });

  app.post('/api/recipes/reset', (req, res) => {
    MockDataService.resetRecipes();

    res.json({ status: 'ok' });
  });
}
