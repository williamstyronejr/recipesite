import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useAuthContext } from '../../context/auth';
import Loading from '../../components/Loading';
import './styles/manageRecipes.css';

const QUERY_USER_RECIPES = gql`
  query ($userId: ID!, $publishedType: String!) {
    getUserRecipes(userId: $userId, publishedType: $publishedType) {
      id
      title
      summary
    }
  }
`;

const DELETE_RECIPE = gql`
  mutation deleteRecipe($recipeId: ID!) {
    deleteRecipe(recipeId: $recipeId)
  }
`;

const ManageRecipesPage = () => {
  const { state, signout } = useAuthContext();
  const [filter, setFilter] = React.useState('all');

  const { loading, data, refetch } = useQuery(QUERY_USER_RECIPES, {
    variables: {
      userId: state.id,
      publishedType: filter,
    },
  });

  const [deleteRecipe] = useMutation(DELETE_RECIPE, {
    refetchQueries: [
      {
        query: QUERY_USER_RECIPES,
        variables: {
          userId: state.id,
          publishedType: filter,
        },
      },
    ],
    onError({ graphQLErrors }) {
      if (graphQLErrors && graphQLErrors[0].extensions) {
        if (graphQLErrors[0].extensions.code === 'UNAUTHENTICATED') {
          return signout();
        }
      }
    },
  });

  React.useEffect(() => {
    refetch({ userId: state.id, publishedType: filter });
  }, [filter, refetch, state.id]);

  if (!state.authenticated) return <Redirect to="/signin" />;

  if (loading || !data) return <Loading />;

  const recipes = data.getUserRecipes || [];

  return (
    <section className="manage">
      <aside className="manage__aside">
        <Link className="manage__button" to="/dashboard">
          <div className="manage__back" />
        </Link>

        <label htmlFor="filter1" className="manage__label">
          <input
            id="filter1"
            name="filter"
            className="manage__radio"
            type="radio"
            value="all"
            onChange={() => setFilter('all')}
            checked={filter === 'all'}
          />
          All
        </label>

        <label htmlFor="filter2" className="manage__label">
          <input
            id="filter2"
            name="filter"
            className="manage__radio"
            type="radio"
            value="private"
            onChange={() => setFilter('private')}
            checked={filter === 'private'}
          />
          Private
        </label>

        <label htmlFor="filter3" className="manage__label">
          <input
            id="filter3"
            name="filter"
            className="manage__radio"
            type="radio"
            value="public"
            onChange={() => setFilter('public')}
            checked={filter === 'public'}
          />
          Public
        </label>
      </aside>

      <div className="manage__content">
        {recipes.length === 0 ? (
          <div className="manage__empty">You have not created a recipe.</div>
        ) : null}

        {recipes.map((recipe: any) => (
          <div className="manage__recipe" key={recipe.id}>
            <Link className="manage__info" to={`/recipe/${recipe.id}`}>
              <h4 className="manage__title">{recipe.title}</h4>
              <p className="manage__summary">{recipe.summary}</p>
            </Link>

            <div className="manage__controls">
              <Link
                className="manage__edit"
                data-cy="edit"
                to={`/recipe/${recipe.id}/edit`}
              >
                Edit
              </Link>
              <button
                className="manage__delete"
                type="button"
                data-cy="delete"
                onClick={() => {
                  deleteRecipe({ variables: { recipeId: recipe.id } });
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ManageRecipesPage;
