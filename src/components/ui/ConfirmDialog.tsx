import styles from './styles/confirmDialog.module.css';

const ConfirmDialog = ({
  onConfirm,
  onCancel,
  message,
}: {
  onConfirm: Function;
  onCancel: Function;
  message: String;
}) => (
  <div className={styles.dialog}>
    <div className={styles.dialog__wrapper}>
      <div className={styles.dialog__message}>{message}</div>

      <button
        className={`${styles.dialog__button} ${styles.dialog__button__confirm}`}
        type="button"
        data-cy="confirm"
        onClick={() => onConfirm()}
      >
        Confirm
      </button>

      <button
        className={`${styles.dialog__button} ${styles.dialog__button__cancel}`}
        type="button"
        data-cy="cancel"
        onClick={() => onCancel()}
      >
        Cancel
      </button>
    </div>
  </div>
);

export default ConfirmDialog;
