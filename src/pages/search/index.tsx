import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import Loading from '@/components/ui/Loading';
import styles from './styles/search.module.css';

const QUERY_SEARCH = gql`
  query searchRecipes(
    $q: String!
    $order: String
    $offset: Int!
    $limit: Int!
  ) {
    searchRecipes(
      search: { q: $q, order: $order, offset: $offset, limit: $limit }
    ) {
      recipes {
        id
        title
        summary
        author
        mainImage
      }
      endOfList
    }
  }
`;

const SearchPage = () => {
  const router = useRouter();
  const searchParams = new URLSearchParams(router.pathname);
  const initSearch = searchParams.get('q') || '';
  const [searchError, setSearchError] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>(initSearch);

  const { loading, data, fetchMore } = useQuery(QUERY_SEARCH, {
    onError() {
      setSearchError(true);
    },
    notifyOnNetworkStatusChange: true,
    variables: {
      q: initSearch,
      offset: 0,
      limit: 10,
    },
  });

  const recipes = data ? data.searchRecipes.recipes : [];
  const endOfList = data ? data.searchRecipes.endOfList : false;

  const [infiniteRef] = useInfiniteScroll({
    loading,
    onLoadMore: () => fetchMore({ variables: { offset: recipes.length } }),
    disabled: !!searchError,
    hasNextPage: !endOfList,
    rootMargin: '0px 0px 200px 0px',
  });

  const onNewSearch = () => {
    router.push(`/search?q=${search}`);
  };

  return (
    <section className={styles.search}>
      <header className={styles.search__header}>
        <h1 className={styles.search__heading}>Recipes</h1>
      </header>

      <aside className={styles.search__filter}>
        <h3 className={styles.search__filter_heading}>Filter</h3>

        <label htmlFor="filter-search">
          <input
            id="filter-search"
            name="filter-search"
            className={styles.filter__search_bar}
            type="text"
            value={search}
            onChange={(evt) => setSearch(evt.target.value)}
            placeholder="Search ..."
            onKeyUp={(evt) => {
              if (evt.key === 'Enter') onNewSearch();
            }}
          />
        </label>
      </aside>

      <div className={styles.search__content}>
        <ul className={styles.search__list}>
          {!loading && recipes.length === 0 ? (
            <li
              className={`${styles.search__item} ${styles.search__item__empty}`}
            >
              No recipes found
            </li>
          ) : null}

          {recipes.map((recipe: any) => (
            <li className={styles.search__item} key={recipe.id}>
              <Link
                className={styles.search__preview_wrapper}
                href={`/recipe/${recipe.id}`}
                title={recipe.title}
              >
                <Image
                  fill={true}
                  className={styles.search__preview}
                  src={`/img/${recipe.mainImage}`}
                  alt="Recipe Example"
                />
              </Link>

              <div className={styles.search__info}>
                <Link
                  className={styles.search__title}
                  href={`/recipe/${recipe.id}`}
                  title={recipe.title}
                >
                  {recipe.title}
                </Link>
                <div className={styles.search__summary}>{recipe.summary}</div>
              </div>
            </li>
          ))}

          {!endOfList && !searchError ? (
            <li
              className={`${styles.search__item} ${styles.search__item__loading}`}
              ref={infiniteRef}
            >
              <Loading />
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  );
};

export default SearchPage;
