import * as React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  from,
  fromPromise,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { createUploadLink } from 'apollo-upload-client';
import './index.css';
import Root from './Root';
import { getCookie } from './utils/utils';
import reportWebVitals from './reportWebVitals';

const authLink = setContext((_, { headers }) => {
  const token = getCookie('csrf-token');

  return {
    headers: {
      ...headers,
      'csrf-token': token,
    },
  };
});

const httpLink = createUploadLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? `/graphql`
      : 'http://localhost:3001/graphql',
  credentials: 'include',
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ extensions, path }) => {
        if (extensions && extensions.code === 'UNAUTHENTICATED') {
          // eslint-disable-next-line no-restricted-globals
          if (path && path[0] !== 'getSession') location.href = '/signin';
        }
      });

      return forward(operation);
    }

    if (networkError && 'statusCode' in networkError) {
      if (networkError.statusCode === 403) {
        return fromPromise(
          fetch('/ctoken', { credentials: 'include', method: 'GET' }).catch(
            () => null,
          ),
        )
          .filter((value) => Boolean(value))
          .flatMap(() => {
            const token = getCookie('csrf-token');
            const oldHeaders = operation.getContext().headers;

            operation.setContext({
              headers: {
                ...oldHeaders,
                'csrf-token': token,
              },
            });
            // retry the request, returning the new observable
            return forward(operation);
          });
      }
    }
  },
);

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getUserRecipes: {
            keyArgs: false,
            merge(existing = { recipes: [], endOfList: true }, incoming) {
              return {
                recipes: [...existing.recipes, ...incoming.recipes],
                endOfList: incoming.endOfList,
              };
            },
          },
          searchRecipes: {
            keyArgs: false,
            merge(existing = { recipes: [], endOfList: true }, incoming) {
              return {
                recipes: [...existing.recipes, ...incoming.recipes],
                endOfList: incoming.endOfList,
              };
            },
          },
          getFavorites: {
            keyArgs: false,
            merge(existing = { items: [], endOfList: true }, incoming) {
              return {
                items: [...existing.items, ...incoming.items],
                endOfList: incoming.endOfList,
              };
            },
          },
        },
      },
    },
  }),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Root />
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
