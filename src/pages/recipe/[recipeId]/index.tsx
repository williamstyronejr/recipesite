import Head from 'next/head';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { useAuthContext } from '@/hooks/useAuth';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Recipe from '@/components/ui/Recipe';
import Comments from '@/components/ui/Comments';
import ErrorPage from '@/components/ui/Error';
import MissingPage from '@/components/ui/Missing';

const QUERY_RECIPE = gql`
  query ($recipeId: ID!) {
    getRecipe(recipeId: $recipeId) {
      id
      entityId
      title
      summary
      directions
      ingredients
      author
      authorName
      authorImage
      mainImage
      prepTime
      cookTime
      avgRating
      userRating
      ratingCount
      favorited
    }
  }
`;

const RecipePage = () => {
  const { query } = useRouter();
  const { state } = useAuthContext();

  const { loading, error, data } = useQuery(QUERY_RECIPE, {
    variables: {
      recipeId: query.recipeId,
    },
    skip: !query || !query.recipeId,
  });

  if (!query || !query.recipeId) return <LoadingScreen />;
  if (error) return <ErrorPage />;
  if (loading || error) return <LoadingScreen />;
  if (!data.getRecipe) return <MissingPage />;

  const {
    id,
    title,
    summary,
    prepTime,
    cookTime,
    authorName,
    author,
    mainImage,
    entityId,
    ingredients,
    directions,
    avgRating,
    userRating,
    ratingCount,
    favorited,
    authorImage,
  } = data.getRecipe;

  return (
    <section className="recipe">
      <Head>
        <title>{title} - Reshipi Bukku</title>
      </Head>

      <Recipe
        id={id}
        entityId={entityId}
        title={title}
        summary={summary}
        prepTime={prepTime}
        cookTime={cookTime}
        authorName={authorName}
        author={author}
        mainImage={mainImage}
        ingredients={ingredients}
        directions={directions}
        avgRating={avgRating}
        userRating={userRating}
        ratingCount={ratingCount}
        isOwner={state.id === author}
        isPreview={false}
        favorited={favorited}
        authorImage={authorImage}
      />

      <Comments
        entityId={entityId}
        userId={state.id || null}
        source={entityId}
      />
    </section>
  );
};

export default RecipePage;
