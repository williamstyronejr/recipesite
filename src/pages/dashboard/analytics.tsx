import styles from './styles/analytics.module.css';

const AnalyticsPage = () => (
  <section className={styles.analytics}>
    <header className={styles.analytics__header} />

    <div className={styles.analytics__summary}>
      <div className={styles.analytics__controls} />
    </div>

    <div className={styles.analytics__location}>
      <h4 className={styles.analytics__subheading}>
        Where did my views come form?
      </h4>
      <div className={styles.analytics__group}>
        <h5 className={styles.analytics__}>Reshipi Bukku</h5>
        <div className={styles.analytics__views}>0 views</div>
      </div>

      <div className={styles.analytics__group}>
        <h5 className={styles.analyltics__group_heading}>External</h5>
        <div className={styles.analytics__views}>0 views</div>
      </div>
    </div>
  </section>
);

AnalyticsPage.auth = {};

export default AnalyticsPage;
