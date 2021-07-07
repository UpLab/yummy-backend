import bodyParser from 'body-parser';
import authRoutes from '../express/routes/auth';
import postRoutes from '../express/routes/recipes';

export default function ExpressLoader(app) {
  app.use(bodyParser.json());

  authRoutes(app);
  postRoutes(app);
}
