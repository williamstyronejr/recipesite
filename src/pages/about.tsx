import styles from './styles/about.module.css';

const AboutPage = () => (
  <>
    <section className={styles.about}>
      <header className={styles.about__header}>
        <h1 className={styles.about__heading}>
          Empowering home chiefs around the world to explore and learn
        </h1>
      </header>
    </section>

    <section className={styles.mission}>
      <header className={styles.mission__header}>
        <h2 className={styles.mission__heading}>
          Our mission is to help creators spread their love for food and store
          family memories.
        </h2>

        <p className={styles.mission__description}>
          To us, food is more than what we eat. We believe in sharing out
          experiences through food and being a place to store those special
          family recipes.
        </p>
      </header>
    </section>

    <section className={styles.passionate}>
      <header className={styles.passionate__header}>
        <h3 className={styles.passionate__heading}>
          We&apos;re passionate about creating
        </h3>
        <div className={styles.passionate__list}>
          <span className={styles.passionate__item}>FOOD</span>
          <span className={styles.passionate__item}>COMMUNITY</span>
          <span className={styles.passionate__item}>FAMILY</span>
        </div>
      </header>
    </section>
  </>
);

export default AboutPage;
