import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';
import './index.css';
import Root from './Root';
import reportWebVitals from './reportWebVitals';

const authLink = setContext(() => {});

const httpLink = createUploadLink({
  uri: 'http://localhost:3001/graphql',
  credentials: 'include',
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          searchRecipes: {
            keyArgs: false,
            merge(existing = { recipes: [], endOfList: true }, incoming) {
              return {
                recipes: [...existing.recipes, ...incoming.recipes],
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
