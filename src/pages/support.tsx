import Link from 'next/link';
import Head from 'next/head';
import styles from './styles/support.module.css';

const SupportPage = () => (
  <section className={styles.support}>
    <Head>
      <title>Support - Reshipi Bukku</title>
    </Head>
    <header className={styles.support__header}>
      <h1 className={styles.support__heading}>
        Support Center
        <div className={styles.support__container}>
          <input
            className={styles.support__input}
            type="text"
            placeholder="Search for a support problem"
          />
        </div>
      </h1>
    </header>

    <div className={styles.support__list}>
      <div className={styles.support__item}>
        <Link className={styles.support__link} href="/recovery">
          Forgot password
        </Link>
      </div>

      <div className={styles.support__item}>
        <Link className={styles.support__link} href="/faq">
          Faq
        </Link>
      </div>
    </div>
  </section>
);

export default SupportPage;
