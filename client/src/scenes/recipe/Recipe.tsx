import * as React from 'react';
import './styles/recipe.css';

const RecipePage = () => (
  <section className="recipe">
    <header className="recipe__header">
      <h1 className="recipe__title">Recipe title</h1>
      <div className="recipe__stats">
        <span className="recipe__">Ratings</span>
      </div>
      <div className="recipe__summary">
        This is a wonderful version of tomato soup.
      </div>
      <div className="recipe__author">Author</div>
    </header>

    <div className="recipe__ingredients">
      <h2 className="recipe__subtitle">Ingredents</h2>
      <div className="">
        <div className="recipe__adjustment">
          <button className="recipe__btn recipe__btn--minus" type="button">
            -
          </button>
          <span className="recipe__servings">12</span>
          <button className="recipe__btn recipe__btn--plus" type="button">
            +
          </button>
        </div>
      </div>

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
  </section>
);

export default RecipePage;
