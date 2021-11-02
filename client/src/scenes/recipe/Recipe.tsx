import * as React from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { useAuthContext } from '../../context/auth';
import Loading from '../../components/Loading';
import MissingPage from '../Missing';
import Recipe from '../../components/Recipe';
import Comments from '../../components/Comments';
import './styles/recipe.css';

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
      mainImage
      prepTime
      cookTime
      avgRating
      userRating
      ratingCount
    }
  }
`;

const RecipePage = () => {
  const { state } = useAuthContext();
  const { recipeId } = useParams<{ recipeId: string }>();

  const { loading, error, data } = useQuery(QUERY_RECIPE, {
    variables: {
      recipeId,
    },
  });

  if (error) return <div>error occurred</div>;
  if (loading) return <Loading />;
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
