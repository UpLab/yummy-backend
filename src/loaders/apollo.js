import server from '../graphql';

export default async function apolloLoader(app) {
  await server.start();

  server.applyMiddleware({ app });
}
