import * as React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/auth';
import './styles/dashboard.css';

const DashboardPage = () => {
  const { state } = useAuthContext();

  return (
    <section className="dashboard">
      <header className="dashboard__header">
        <h1 className="dashboard__heading">
          Welcome back,
          {` ${state.username}`}
        </h1>
      </header>

      <aside className="dashboard__aside">
        <Link className="dashboard__link" to="/account/recipe/create">
          Create Recipe
        </Link>
        <Link className="dashboard__link" to="/dashboard/manage">
          Manage Recipes
        </Link>
        <Link className="dashboard__link" to="/dashboard/favorites">
          Favorites
        </Link>
      </aside>

      <div className="dashboard__content">
        <div className="dashboard__analytics">
          <div className="dashboard__content-heading">
            <Link className="dashboard__content-link" to="/dashboard/analytics">
              Analytics
            </Link>
          </div>

          <div className="dashboard__content-unavailable">
            Analytics are currently not available
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
