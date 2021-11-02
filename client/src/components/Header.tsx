import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import RecipeSearch from './RecipeSearch';
import { useAuthContext } from '../context/auth';
import './styles/header.css';

const AuthNav = ({
  userId,
  signout,
}: {
  userId: number;
  signout: Function;
}) => (
  <ul className="header__list">
    <li className="header__item header__item--title">
      <Link className="header__link" to="/">
        Reshipi
        <span className="header__text-alt"> Bukku</span>
      </Link>
    </li>

    <li className="header__item">
      <Link className="header__link" to="/explore/popular">
        Recipes
      </Link>
    </li>

    <li className="header__item">
      <Link className="header__link" to="/dashboard">
        Dashboard
      </Link>
    </li>

    <li className="header__item">
      <Link className="header__link" to={`/account/profile/${userId}`}>
        Profile
      </Link>
    </li>

    <li className="header__item">
      <Link className="header__link" to="/account/settings">
        Settings
      </Link>
    </li>

    <li className="header__item">
      <button
        className="header__link"
        type="button"
        onClick={() => {
          signout();
        }}
      >
        Signout
      </button>
    </li>
  </ul>
);

const Header = () => {
  const [menuActive, setMenuActive] = React.useState<Boolean>(false);
  const location = useLocation();
  const { state, signout } = useAuthContext();

  React.useEffect(() => {
    setMenuActive(false);
  }, [location.pathname]);

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
        {state.authenticated ? (
          <AuthNav userId={state.id as number} signout={signout} />
        ) : (
          <ul className="header__list">
            <li className="header__item header__item--title">
              <Link className="header__link" to="/">
                Reshipi
                <span className="header__text-alt"> Bukku</span>
              </Link>
            </li>

            <li className="header__item">
              <Link className="header__link" to="/explore/popular">
                Recipes
              </Link>
            </li>

            <li className="header__item">
              <Link className="header__link" to="/signin" data-cy="signin">
                Signin
              </Link>
            </li>

            <li className="header__item">
              <Link className="header__link" to="/signup">
                Signup
              </Link>
            </li>
          </ul>
        )}
      </nav>

      <div className="header__search">
        <RecipeSearch />
      </div>

      <div className="header__overlay" />
    </header>
  );
};

export default Header;
