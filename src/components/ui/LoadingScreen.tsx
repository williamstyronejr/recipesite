import { FC } from 'react';
import styles from './styles/loading.module.css';

const LoadingScreen: FC<{ message?: string }> = ({ message = '' }) => {
  return (
    <div className={styles.loading__full}>
      <div className={styles.loading__dots}>
        <div />
        <div />
        <div />
        <div />
      </div>
      {message}
    </div>
  );
};

export default LoadingScreen;
