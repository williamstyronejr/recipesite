import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useAuthContext } from '@/hooks/useAuth';
import Loading from '@/components/ui/Loading';
import styles from './styles/manage.module.css';

const QUERY_USER_RECIPES = gql`
  query ($userId: ID!, $publishedType: String!, $limit: Int!, $offset: Int!) {
    getUserRecipes(
      userId: $userId
      publishedType: $publishedType
      limit: $limit
      offset: $offset
    ) {
      recipes {
        id
        title
        summary
        published
      }
      endOfList
    }
  }
`;

const DELETE_RECIPE = gql`
  mutation deleteRecipe($recipeId: ID!) {
    deleteRecipe(recipeId: $recipeId)
  }
`;

const ManageRecipesPage = () => {
  const { state } = useAuthContext();
  const [filter, setFilter] = useState('all');

  const {
    loading,
    data,
    error: fetchError,
    refetch,
    fetchMore,
  } = useQuery(QUERY_USER_RECIPES, {
    variables: {
      userId: state.id,
      publishedType: filter,
      offset: 0,
      limit: 10,
    },
  });

  const [deleteRecipe] = useMutation(DELETE_RECIPE, {
    refetchQueries: [
      {
        query: QUERY_USER_RECIPES,
        variables: {
          userId: state.id,
          publishedType: filter,
          limit: 10,
          offset: 0,
        },
      },
    ],
  });

  const recipes = data ? data.getUserRecipes.recipes : [];
  const endOfList = data ? data.getUserRecipes.endOfList : false;

  const [infiniteRef] = useInfiniteScroll({
    loading,
    onLoadMore: () => fetchMore({ variables: { offset: recipes.length } }),
    disabled: !!fetchError,
    hasNextPage: !endOfList,
    rootMargin: '0px 0px 200px 0px',
  });

  useEffect(() => {
    refetch({ userId: state.id, publishedType: filter, limit: 10, offset: 0 });
  }, [filter, state.id, refetch]);

  return (
    <section className={styles.manage}>
      <Head>
        <title>Manage - Reshipi Bukku</title>
      </Head>

      <aside className={styles.manage__aside}>
        <Link className={styles.manage__button} href="/dashboard">
          <div className={styles.manage__back} />
        </Link>

        <label htmlFor="filter1" className={styles.manage__label}>
          <input
            id="filter1"
            name="filter"
            className={styles.manage__radio}
            type="radio"
            value="all"
            onChange={() => setFilter('all')}
            checked={filter === 'all'}
          />
          All
        </label>

        <label htmlFor="filter2" className={styles.manage__label}>
          <input
            id="filter2"
            name="filter"
            className={styles.manage__radio}
            type="radio"
            value="private"
            onChange={() => setFilter('private')}
            checked={filter === 'private'}
          />
          Private
        </label>

        <label htmlFor="filter3" className={styles.manage__label}>
          <input
            id="filter3"
            name="filter"
            className={styles.manage__radio}
            type="radio"
            value="public"
            onChange={() => setFilter('public')}
            checked={filter === 'public'}
          />
          Public
        </label>
      </aside>

      <div className={styles.manage__content}>
        {recipes.length === 0 ? (
          <div className={styles.manage__empty}>
            You have not created a recipe.
          </div>
        ) : null}

        {recipes.map((recipe: any) => (
          <div className={styles.manage__recipe} key={recipe.id}>
            <Link className={styles.manage__info} href={`/recipe/${recipe.id}`}>
              <h4 className={styles.manage__title}>
                {recipe.published ? (
                  <span
                    className={`${styles.manage__status} ${styles.manage__status__public}`}
                  >
                    Public
                  </span>
                ) : (
                  <span
                    className={`${styles.manage__status} ${styles.manage__status__private}`}
                  >
                    Private
                  </span>
                )}
                {recipe.title}
              </h4>
              <p className={styles.manage__summary}>{recipe.summary}</p>
            </Link>

            <div className={styles.manage__controls}>
              <Link
                className={styles.manage__edit}
                data-cy="edit"
                href={`/recipe/${recipe.id}/edit`}
              >
                Edit
              </Link>
              <button
                className={styles.manage__delete}
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

        {!endOfList && !fetchError ? (
          <div ref={infiniteRef}>
            <Loading />
          </div>
        ) : null}
      </div>
    </section>
  );
};

ManageRecipesPage.auth = {};

export default ManageRecipesPage;
