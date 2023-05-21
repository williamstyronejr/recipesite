import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useQuery, gql } from '@apollo/client';
import Loading from '@/components/ui/Loading';
import styles from './styles/favorites.module.css';

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

const FavoritesPage = () => {
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
    <section className={styles.favorites}>
      <Head>
        <title>Favorites - Reshipi Bukku</title>
      </Head>

      <header className={styles.favorites__header}>
        <h3 className={styles.favorites__heading}>Favorites</h3>
      </header>

      <div className={styles.favorites__list}>
        {items.length === 0 ? (
          <div
            className={`${styles.favorites__item} ${styles.favorites__item__missing}`}
          >
            Your favorite recipes and articles will be found here.
          </div>
        ) : null}

        {items.map((item: any) => (
          <div className={styles.favorites__item} key={item.id}>
            <Link
              className={styles.favorites__preview_wrapper}
              href={`/recipe/${item.id}`}
              title={item.title}
            >
              <Image
                fill={true}
                className={styles.favorites__preview}
                src={item.mainImage}
                alt="Recipe Example"
              />
            </Link>

            <div className={styles.favorites__info}>
              <Link
                className={styles.favorites__title}
                href={`/recipe/${item.id}`}
                title={item.title}
              >
                {item.title}
              </Link>
              <div className={styles.favorites__summary}>{item.summary}</div>
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

FavoritesPage.auth = {};

export default FavoritesPage;
