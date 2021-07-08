import { gql } from 'apollo-server-express';
import UsersService from '../services/UsersService';

// Construct a schema, using GraphQL schema language
export const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
  }

  type Query {
    me: User
  }

  type AuthResponse {
    accessToken: String!
    refreshToken: String
  }

  type Mutation {
    login(email: String!, password: String!): AuthResponse!
    register(email: String!, password: String!): AuthResponse!
    token(token: String!): AuthResponse!
    logout(token: String!): Boolean
  }
`;

// Provide resolver functions for your schema fields
export const resolvers = {
  Query: {
    me: (root, params, context) => {
      return context.getUser();
    },
  },
  Mutation: {
    login: async (root, params, context) => {
      const { email, password } = params;
      const { accessToken, refreshToken } = await UsersService.loginWithPassword({ email, password });
      return { accessToken, refreshToken };
    },
    register: async (root, params, context) => {
      const { email, password } = params;
      await UsersService.createAccount({ email, password });
      const { accessToken, refreshToken } = await UsersService.loginWithPassword({ email, password });
      return { accessToken, refreshToken };
    },
    token: async (root, params, context) => {
      const { token: refreshToken } = params;

      const { accessToken } = UsersService.loginWithRefreshToken(refreshToken);
      return { accessToken };
    },
    logout: async (root, params, context) => {
      const { token: refreshToken } = params;
      UsersService.logout(refreshToken);
      return true;
    },
  },
};
