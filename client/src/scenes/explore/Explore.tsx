import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import MissingPage from '../Missing';
import './styles/index.css';

const QUERY_MAIN_RECIPE = gql`
  query searchRecipes($limit: Int!, $offset: Int!, $author: String!) {
    searchRecipes(search: { offset: $offset, limit: $limit, author: $author }) {
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
  <div className="explore__recipe">
    <img
      className="explore__image"
      src={`/img/${mainImage}`}
      alt="Recipe example"
    />

    <div className="explore__details">
      <h3 className="explore__title">
        <Link to={`/recipe/${id}`}>{title}</Link>
      </h3>

      <div className="explore__summary">{summary}</div>
    </div>
  </div>
);

const Popular = () => {
  const { data } = useQuery(QUERY_MAIN_RECIPE, {
    variables: { limit: 3, offset: 0, author: 'ReshipiBukku' },
  });

  const recipes = data && data.searchRecipes ? data.searchRecipes.recipes : [];

  return (
    <section className="explore">
      <header className="explore__header">
        <div className="explore__max">
          <div className="explore__wrapper">
            <h2 className="explore__heading">Popular</h2>
            <p className="explore__text">
              Create one a delicious everyday meal hand picked by our staff.
            </p>
          </div>
        </div>
      </header>

      <div className="explore__content">
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
  const { type } = useParams<{ type: string }>();

  let content;

  switch (type) {
    case 'popular':
      content = <Popular />;
      break;

    default:
      content = <MissingPage />;
  }

  return content;
};

export default ExplorePage;
