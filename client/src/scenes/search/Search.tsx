import * as React from 'react';
import { useLocation } from 'react-router-dom';

const SearchPage = () => {
  const recipes: any[] = [];
  const searchParams = new URLSearchParams(useLocation().search);
  const search = searchParams.get('q');
  console.log(search);

  React.useEffect(() => {
    // Grab recipes
  }, []);

  return (
    <section className="search">
      <header className="search__header">
        <h1 className="search__heading">Recipes</h1>
      </header>

      <aside className="search__filter">filter</aside>

      <div className="search__list">
        {recipes.map((recipe) => (
          <div className="search__item">{recipe}</div>
        ))}
      </div>
    </section>
  );
};

export default SearchPage;
