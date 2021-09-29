import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { useAuthContext } from '../../context/auth';
import Loading from '../../components/Loading';
import './styles/recipe.css';

const QUERY_RECIPE = gql`
  query ($recipeId: ID!) {
    getRecipe(recipeId: $recipeId) {
      id
      title
      summary
      directions
      ingredients
      author
      authorName
      mainImage
      prepTime
      cookTime
    }
  }
`;

const RecipeNotFound = () => (
  <section className="recipe recipe--missing">
    <div className="recipe__404">This recipe does not exist</div>
    <Link to="/recipes/popular">Check out more popular recipes here</Link>
  </section>
);

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
  if (!data.getRecipe) return <RecipeNotFound />;

  const {
    id,
    title,
    summary,
    prepTime,
    cookTime,
    authorName,
    author,
    mainImage,
  } = data.getRecipe;

  return (
    <section className="recipe">
      <div className="recipe__wrapper">
        <header className="recipe__header">
          <img
            className="recipe__img"
            src={`/img/${mainImage}`}
            alt="Recipe Example"
          />

          <h1 className="recipe__title">{title}</h1>

          <div className="recipe__summary">{summary}</div>

          <div className="recipe__stats">
            <span className="recipe__cook">{cookTime} min</span>
            <span className="recipe__prep">{prepTime} min</span>
          </div>

          <div className="recipe__controls">
            {state.id === author ? (
              <div className="recipe__options">
                <Link className="" to={`/recipe/${id}/edit`}>
                  Edit
                </Link>
              </div>
            ) : null}
          </div>

          <Link className="recipe__author" to={`/account/profile/${author}`}>
            <img
              className="recipe__author-img"
              src="https://cdn.dribbble.com/users/2527772/screenshots/11920939/media/24291b3fd033123e1507cbff2080e59e.png"
              alt="User Profile"
            />
            <div className="recipe__author-name">{authorName}</div>
            <div className="recipe__arrow" />
          </Link>
        </header>

        <div className="recipe__ingredients">
          <h2 className="recipe__subtitle">Ingredents</h2>

          <ul className="recipe__list recipe__list--ingredients">
            <li className="recipe__item">
              <span className="recipe__amount">2</span>
              cups of Flour
            </li>
          </ul>
        </div>

        <div className="recipe__directions">
          <h3 className="recipe__direction-title">24 Method</h3>
          <ul className="recipe__list recipe__list--direction">
            <li className="recipe__item recipe__item--direction">
              Wash and dry the exterior of each cucumber.
            </li>
          </ul>
        </div>

        <div className="recipe__facts">
          <h2 className="recipe__subtitle">Nutrition Facts</h2>

          <div className="recipe__nutrition">
            No facts are availble at this time.
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecipePage;
