import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import useOutsideClick from '@/hooks/useOutsideClick';
import { useState, useEffect, FC, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthProvider, useAuthContext } from '@/hooks/useAuth';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apolloClient';
import styles from './styles/Header.module.css';
import Loading from '@/components/ui/Loading';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const AuthNav = ({
  userId,
  signout,
}: {
  userId: number;
  signout: Function;
}) => (
  <ul className={styles.header__list}>
    <li className={`${styles.header__item} ${styles.header__item__title}`}>
      <Link className={styles.header__link} href="/">
        Reshipi
        <span className={styles.header__text_alt}> Bukku</span>
      </Link>
    </li>

    <li className={styles.header__item}>
      <Link className={styles.header__link} href="/explore/popular">
        Recipes
      </Link>
    </li>

    <li className={styles.header__item}>
      <Link className={styles.header__link} href="/dashboard">
        Dashboard
      </Link>
    </li>

    <li className={styles.header__item}>
      <Link className={styles.header__link} href={`/account/profile/${userId}`}>
        Profile
      </Link>
    </li>

    <li className={styles.header__item}>
      <Link className={styles.header__link} href="/account/settings">
        Settings
      </Link>
    </li>

    <li className={styles.header__item}>
      <button
        className={styles.header__link}
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
  const { state, signout } = useAuthContext();
  const { pathname } = useRouter();
  const [navMenu, setNavMenu] = useState(false);
  const [menuActive, setMenuActive] = useState<Boolean>(false);

  const ref = useOutsideClick({
    ignoreButton: true,
    active: navMenu,
    closeEvent: () => {
      setNavMenu(false);
    },
  });

  useEffect(() => {
    setMenuActive(false);
  }, [pathname]);

  return (
    <header className={styles.header} ref={ref}>
      <button
        type="button"
        className={styles.header__menu}
        onClick={() => setMenuActive(!menuActive)}
      >
        <span className={`${styles.header__bar} ${styles.header__bar__1}`} />
        <span className={`${styles.header__bar} ${styles.header__bar__2}`} />
        <span className={`${styles.header__bar} ${styles.header__bar__3}`} />
      </button>

      <nav className={styles.header__nav} role="navigation">
        {state.authenticated ? (
          <AuthNav userId={state.id as number} signout={signout} />
        ) : (
          <ul className={styles.header__list}>
            <li
              className={`${styles.header__item} ${styles.header__item__title}`}
            >
              <Link className={styles.header__link} href="/">
                Reshipi
                <span className={styles.header__text_alt}> Bukku</span>
              </Link>
            </li>

            <li className={styles.header__item}>
              <Link className={styles.header__link} href="/explore/popular">
                Recipes
              </Link>
            </li>

            <li className={styles.header__item}>
              <Link
                className={styles.header__link}
                href="/signin"
                data-cy="signin"
              >
                Signin
              </Link>
            </li>

            <li className={styles.header__item}>
              <Link className={styles.header__link} href="/signup">
                Signup
              </Link>
            </li>
          </ul>
        )}
      </nav>

      <div className={styles.header__search}>{/* <RecipeSearch /> */}</div>

      <div className={styles.header__overlay} />
    </header>
  );
};

const Auth: FC<{
  auth: { admin?: boolean };
  children: ReactNode;
}> = ({ auth, children }) => {
  const router = useRouter();
  const { state } = useAuthContext();

  if (state.authenticating) return <Loading />;
  if (!auth) return <>{children}</>;
  if (auth && !state.authenticated) {
    router.push('/signin');
    return <Loading />;
  }

  return <>{children}</>;
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ApolloProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Auth auth={(Component as any).auth}>
              <Header />
              <main>
                <Component {...pageProps} />
              </main>
            </Auth>
          </AuthProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </>
  );
}
