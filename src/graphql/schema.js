import { gql } from 'apollo-server-express';
import { typeDefs as authTypeDefs, resolvers as authResolvers } from './schemas/auth';
import { typeDefs as recipeTypeDefs, resolvers as recipeResolvers } from './schemas/recipes';

const rootTypeDefs = gql`
  type Query {
    _empty: Boolean
  }
  type Mutation {
    _empty: Boolean
  }
`;

export const typeDefs = [rootTypeDefs, authTypeDefs, recipeTypeDefs];
export const resolvers = [authResolvers, recipeResolvers];
