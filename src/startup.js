import express from 'express';
import RootLoader from './loaders';

export default async function startServer() {
  const app = express();
  const port = process.env.PORT;

  await RootLoader(app);

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}
