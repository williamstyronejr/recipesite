import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import RecipeSearch from './RecipeSearch';
import './styles/header.css';

const Header = () => {
  const [menuActive, setMenuActive] = React.useState<Boolean>(false);
  const location = useLocation();

  React.useEffect(() => {
    if (menuActive) setMenuActive(false);
  }, [location.pathname, menuActive]);

  return (
    <header className={`header ${menuActive ? 'menu__active' : ''}`}>
      <button
        type="button"
        className="header__menu"
        onClick={() => setMenuActive(!menuActive)}
      >
        <span className="header__bar header__bar--1" />
        <span className="header__bar header__bar--2" />
        <span className="header__bar header__bar--3" />
      </button>

      <nav className="header__nav" role="navigation">
        <ul className="header__list">
          <li className="header__item header__item--title">
            <Link className="header__link" to="/">
              Reshipi
              <span className="header__text-alt"> Bukku</span>
            </Link>
          </li>

          <li className="header__item">
            <Link className="header__link" to="/recipes/popular">
              Recipes
            </Link>
          </li>

          <li className="header__item">
            <Link className="header__link" to="/signin">
              Signin
            </Link>
          </li>
        </ul>
      </nav>

      <div className="header__search">
        <RecipeSearch />
      </div>

      <div className="header__overlay" />
    </header>
  );
};

export default Header;
