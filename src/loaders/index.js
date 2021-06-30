/* eslint-disable no-console */
import expressLoader from './express';
import fixturesLoader from './fixtures';
import dbLoader from './db';

export default async function RootLoader(app) {
  console.log('Connecting to the database...');
  await dbLoader();
  console.log('Connected to the database successfully');

  console.log('Starting express server...');
  expressLoader(app);
  console.log('Express server started successfully');

  console.log('Started processing fixtures');
  fixturesLoader();
  console.log('Fixtures processed successfully');
}
