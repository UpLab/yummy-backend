import { gql, SchemaDirectiveVisitor, AuthenticationError } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';

export default class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    // eslint-disable-next-line no-param-reassign
    field.resolve = async function f(...args) {
      const [root, params, context] = args;
      if (!context.userId) {
        throw new AuthenticationError('Not authorized');
      }

      return resolve.apply(this, args);
    };
  }
}

export const typeDefs = gql`
  directive @auth on FIELD_DEFINITION
`;
