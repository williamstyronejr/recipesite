import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { useAuthContext } from '@/hooks/useAuth';
import Loading from '@/components/ui/Loading';
import Recipe from '@/components/ui/Recipe';
import Comments from '@/components/ui/Comments';
import ErrorPage from '@/components/ui/Error';

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

  if (!query || !query.recipeId) return <Loading />;
  if (error) return <ErrorPage />;
  if (loading || error) return <Loading />;
  if (!data.getRecipe) return null;

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
        // userId={state.id || null}
        userId={null}
        source={entityId}
      />
    </section>
  );
};

export default RecipePage;
