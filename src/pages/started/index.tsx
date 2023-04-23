import Link from 'next/link';
import Image from 'next/image';
import styles from './styles/index.module.css';

const StartedPage = () => {
  return (
    <section className={styles.started}>
      <header className={styles.started__header}>
        <h1 className={styles.started__heading}>
          Let start with the type of meal
        </h1>
      </header>

      <div className={styles.started__options}>
        <Link className={styles.started__option} href="/explore/breakfest">
          <Image
            fill={true}
            className={styles.started__image}
            src="/images/site/breakfest.jpg"
            alt="Breakfest"
          />
          Breakfest
        </Link>

        <Link className={styles.started__option} href="/explore/lunch">
          <Image
            fill={true}
            className={styles.started__image}
            src="/images/site/lunch.jpg"
            alt="Food"
          />
          Lunch
        </Link>

        <Link className={styles.started__option} href="/explore/dinner">
          <Image
            fill={true}
            className={styles.started__image}
            src="/images/site/dinner.jpeg"
            alt="Food"
          />
          Dinner
        </Link>

        <Link className={styles.started__option} href="/explore/dessert">
          <Image
            fill={true}
            className={styles.started__image}
            src="/images/site/dessert.jpg"
            alt="Food"
          />
          Dessert
        </Link>
      </div>
    </section>
  );
};

export default StartedPage;
