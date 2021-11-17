import * as React from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import Loading from '../../components/Loading';
import './styles/search.css';

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
  const history = useHistory();
  const searchParams = new URLSearchParams(useLocation().search);
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
    history.push(`/search?q=${search}`);
  };

  return (
    <section className="search">
      <header className="search__header">
        <h1 className="search__heading">Recipes</h1>
      </header>

      <aside className="search__filter">
        <h3 className="search__filter-heading">Filter</h3>

        <label htmlFor="filter-search" className="">
          <input
            id="filter-search"
            name="filter-search"
            className="filter__search-bar"
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

      <div className="search__content">
        <ul className="search__list">
          {!loading && recipes.length === 0 ? (
            <li className="search__item search__item--empty">
              No recipes found
            </li>
          ) : null}

          {recipes.map((recipe: any) => (
            <li className="search__item" key={recipe.id}>
              <Link to={`/recipe/${recipe.id}`} title={recipe.title}>
                <img
                  className="search__preview"
                  src={`/img/${recipe.mainImage}`}
                  alt="Recipe Example"
                />
              </Link>

              <div className="search__info">
                <Link
                  className="search__title"
                  to={`/recipe/${recipe.id}`}
                  title={recipe.title}
                >
                  {recipe.title}
                </Link>
                <div className="search__summary">{recipe.summary}</div>
              </div>
            </li>
          ))}

          {!endOfList && !searchError ? (
            <li
              className="search__item search__item--loading"
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
