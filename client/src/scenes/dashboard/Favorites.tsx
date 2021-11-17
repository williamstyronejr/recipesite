import * as React from 'react';
import { useQuery, gql } from '@apollo/client';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import './styles/favorites.css';

const QUERY_FAVORITES = gql`
  query getFavorites($limit: Int!, $offset: Int!) {
    getFavorites(limit: $limit, offset: $offset) {
      items {
        ... on Recipe {
          id
          title
          author
          summary
          mainImage
        }
      }
      endOfList
    }
  }
`;

const Favorites = () => {
  const {
    loading,
    data,
    error: fetchError,
    fetchMore,
  } = useQuery(QUERY_FAVORITES, {
    variables: { limit: 10, offset: 0 },
    notifyOnNetworkStatusChange: true,
  });

  const items = data ? data.getFavorites.items : [];
  const endOfList = data ? data.getFavorites.endOfList : false;

  const [infiniteRef] = useInfiniteScroll({
    loading,
    onLoadMore: () => fetchMore({ variables: { offset: items.length } }),
    disabled: !!fetchError,
    hasNextPage: !endOfList,
    rootMargin: '0px 0px 200px 0px',
  });

  return (
    <section className="favorites">
      <header className="favorites__header">
        <h3 className="favorites__heading">Favorites</h3>
      </header>

      <div className="favorites__list">
        {items.length === 0 ? (
          <div className="favorites__item favorites__item--missing">
            Your favorite recipes and articles will be found here.
          </div>
        ) : null}

        {items.map((item: any) => (
          <div className="favorites__item">
            <Link to={`/recipe/${item.id}`} title={item.title}>
              <img
                className="favorites__preview"
                src={`/img/${item.mainImage}`}
                alt="Recipe Example"
              />
            </Link>

            <div className="favorites__info">
              <Link
                className="favorites__title"
                to={`/recipe/${item.id}`}
                title={item.title}
              >
                {item.title}
              </Link>
              <div className="favorites__summary">{item.summary}</div>
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

export default Favorites;
