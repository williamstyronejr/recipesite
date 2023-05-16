import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import styles from './styles/index.module.css';

const QUERY_MAIN_RECIPE = gql`
  query searchRecipes(
    $limit: Int!
    $offset: Int!
    $author: String!
    $type: String!
  ) {
    searchRecipes(
      search: { offset: $offset, limit: $limit, author: $author, type: $type }
    ) {
      recipes {
        id
        title
        summary
        mainImage
      }
    }
  }
`;

const RecipeComponent = ({
  id,
  title,
  summary,
  mainImage,
}: {
  id: string;
  title: string;
  summary: string;
  mainImage: string;
}) => (
  <div className={styles.explore__recipe}>
    <div className={styles.explore__image_wrapper}>
      <Image
        fill={true}
        className={styles.explore__image}
        src={mainImage}
        alt="Recipe example"
      />
    </div>

    <div className={styles.explore__details}>
      <h3 className={styles.explore__title}>
        <Link href={`/recipe/${id}`}>{title}</Link>
      </h3>

      <div className={styles.explore__summary}>{summary}</div>
    </div>
  </div>
);

const Popular = ({ type }: { type: string }) => {
  const { data } = useQuery(QUERY_MAIN_RECIPE, {
    variables: { limit: 8, offset: 0, author: 'ReshipiBukku', type },
    fetchPolicy: 'no-cache',
  });

  const recipes = data && data.searchRecipes ? data.searchRecipes.recipes : [];

  return (
    <section className={styles.explore}>
      <Head>
        <title>Popular - Reshipi Bukku</title>
      </Head>

      <header className={styles.explore__header}>
        <div className={styles.explore__max}>
          <div className={styles.explore__wrapper}>
            <h2 className={styles.explore__heading}>Popular</h2>
            <p className={styles.explore__text}>
              Create one a delicious everyday meal hand picked by our staff.
            </p>
          </div>
        </div>
      </header>

      <div className={styles.explore__content}>
        {recipes.map((recipe: any) => (
          <RecipeComponent
            key={recipe.id}
            id={recipe.id}
            title={recipe.title}
            summary={recipe.summary}
            mainImage={recipe.mainImage}
          />
        ))}
      </div>
    </section>
  );
};

const ExplorePage = () => {
  const { query } = useRouter();

  if (!query.type) return null;

  return <Popular type={query.type.toString()} />;
};

export default ExplorePage;
