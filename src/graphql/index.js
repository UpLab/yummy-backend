import { ApolloServer } from 'apollo-server-express';
import AuthService from '../services/AuthService';
import UsersService from '../services/UsersService';
import { typeDefs, resolvers } from './schema';
import AuthDirective, { typeDefs as authDirectiveTypeDefs } from './directives/auth';

const getUserContext = ({ req }) => {
  const authHeader = req.headers.authorization;
  const token = authHeader;

  const ctx = {
    userId: null,
    jwtUser: null,
    getUser: () => null,
  };
  if (!token) return ctx;
  try {
    const jwtUser = AuthService.verifyAccessToken(token);
    return {
      ...ctx,
      userId: jwtUser._id,
      jwtUser,
      getUser: () => UsersService.findById(jwtUser._id),
    };
  } catch (error) {
    return ctx;
  }
};

const server = new ApolloServer({
  typeDefs: [authDirectiveTypeDefs, ...typeDefs],
  resolvers,
  context: (expressContext) => {
    return {
      ...getUserContext(expressContext),
    };
  },
  schemaDirectives: {
    auth: AuthDirective,
  },
});

export default server;
