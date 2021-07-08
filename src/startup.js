import express from 'express';
import RootLoader from './loaders';
import logger from './utils/logger';

export default async function startServer() {
  try {
    const app = express();
    const port = process.env.PORT;

    await RootLoader(app);

    app.listen(port, () => {
      logger.info(`
        #############################################
          Server listening on port: ${port} 
          Address: http://localhost:${port} ️
          GraphQL: http://localhost:${port}/graphql ️
        #############################################
      `);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}
