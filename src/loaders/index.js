/* eslint-disable no-console */
import expressLoader from './express';
import fixturesLoader from './fixtures';
import dbLoader from './db';
import logger from '../utils/logger';

export default async function RootLoader(app) {
  logger.info('Connecting to the database...');
  await dbLoader();
  logger.info('Connected to the database successfully');

  logger.info('Starting express server...');
  expressLoader(app);
  logger.info('Express server started successfully');

  logger.info('Started processing fixtures');
  await fixturesLoader();
  logger.info('Fixtures processed successfully');
}
