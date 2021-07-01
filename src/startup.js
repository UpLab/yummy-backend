import express from 'express';
import RootLoader from './loaders';

export default async function startServer() {
  try {
    const app = express();
    const port = process.env.PORT;

    await RootLoader(app);

    app.listen(port, () => {
      console.log(`
        #############################################
          Server listening on port: ${port} 
          Address: http://localhost:${port} ️
        #############################################
      `);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
