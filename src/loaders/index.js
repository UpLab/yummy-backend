import expressLoader from './express';
import fixturesLoader from './fixtures';

export default function RootLoader(app) {
  expressLoader(app);
  fixturesLoader();
}
