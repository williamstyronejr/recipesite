import { FC } from 'react';
import styles from './styles/loading.module.css';

const Loading: FC<{ message?: string }> = ({ message = '' }) => {
  return (
    <div className={styles.loading}>
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

export default Loading;
