import * as React from 'react';
import { Link } from 'react-router-dom';
import './styles/started.css';

const StartedPage = () => (
  <section className="started">
    <header className="started__header">
      <h1 className="started__heading">Let start with the type of meal</h1>
    </header>

    <div className="started__options">
      <Link className="started__option" to="/explore/breakfest">
        <img
          className="started__image"
          src="/img/site/breakfest.jpg"
          alt="Food"
        />
        Breakfest
      </Link>

      <Link className="started__option" to="/explore/lunch">
        <img className="started__image" src="/img/site/lunch.jpg" alt="Food" />
        Lunch
      </Link>

      <Link className="started__option" to="/explore/dinner">
        <img
          className="started__image"
          src="/img/site/dinner.jpeg"
          alt="Food"
        />
        Dinner
      </Link>

      <Link className="started__option" to="/explore/dessert">
        <img
          className="started__image"
          src="/img/site/dessert.jpg"
          alt="Food"
        />
        Dessert
      </Link>
    </div>
  </section>
);

export default StartedPage;
