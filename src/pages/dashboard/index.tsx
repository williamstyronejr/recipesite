import Link from 'next/link';
import { useAuthContext } from '@/hooks/useAuth';
import styles from './styles/dashboard.module.css';

const DashboardPage = () => {
  const { state } = useAuthContext();

  return (
    <section className={styles.dashboard}>
      <header className={styles.dashboard__header}>
        <h1 className={styles.dashboard__heading}>
          Welcome back,
          {` ${state.username}`}
        </h1>
      </header>

      <aside className={styles.dashboard__aside}>
        <Link className={styles.dashboard__link} href="/account/recipe/create">
          Create Recipe
        </Link>
        <Link className={styles.dashboard__link} href="/dashboard/manage">
          Manage Recipes
        </Link>
        <Link className={styles.dashboard__link} href="/dashboard/favorites">
          Favorites
        </Link>
      </aside>

      <div className={styles.dashboard__content}>
        <div className={styles.dashboard__analytics}>
          <div className={styles.dashboard__content_heading}>
            <Link
              className={styles.dashboard__content_link}
              href="/dashboard/analytics"
            >
              Analytics
            </Link>
          </div>

          <div className={styles.dashboard__content_unavailable}>
            Analytics are currently not available
          </div>
        </div>
      </div>
    </section>
  );
};

DashboardPage.auth = {};

export default DashboardPage;
