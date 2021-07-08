import { ApolloServer } from 'apollo-server-express';
import AuthService from '../services/AuthService';
import UsersService from '../services/UsersService';
import { typeDefs, resolvers } from './schema';

const getUserContext = ({ req }) => {
  const authHeader = req.headers.authorization;
  const token = authHeader;

  const ctx = {
    jwtUser: null,
    getUser: () => null,
  };
  if (!token) return ctx;
  try {
    const jwtUser = AuthService.verifyAccessToken(token);
    return {
      ...ctx,
      jwtUser,
      getUser: () => UsersService.findById(jwtUser._id),
    };
  } catch (error) {
    return ctx;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (expressContext) => {
    return {
      ...getUserContext(expressContext),
    };
  },
});

export default server;
