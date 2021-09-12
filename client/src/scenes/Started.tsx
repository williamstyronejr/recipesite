import * as React from 'react';
import { Link } from 'react-router-dom';
import './styles/started.css';

const StartedPage = () => (
  <section className="started">
    <header className="started__header">
      <h1 className="started__heading">Let start with the type of meal</h1>
    </header>

    <div className="started__options">
      <Link className="started__option" to="/recipes/breakfest">
        Breakfest
      </Link>
      <Link className="started__option" to="/recipes/lunch">
        Lunch
      </Link>
      <Link className="started__option" to="/recipes/dinner">
        Dinner
      </Link>
      <Link className="started__option" to="/recipes/dessert">
        Dessert
      </Link>
      <Link className="started__option" to="/recipes/snack">
        Snack
      </Link>
    </div>
  </section>
);

export default StartedPage;
