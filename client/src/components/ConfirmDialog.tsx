import * as React from 'react';
import './styles/confirmDialog.css';

const ConfirmDialog = ({
  onConfirm,
  onCancel,
  message,
}: {
  onConfirm: Function;
  onCancel: Function;
  message: String;
}) => (
  <div className="dialog">
    <div className="dialog__wrapper">
      <div className="dialog__message">{message}</div>

      <button
        className="dialog__button dialog__button--confirm"
        type="button"
        data-cy="confirm"
        onClick={() => onConfirm()}
      >
        Confirm
      </button>

      <button
        className="dialog__button dialog__button--cancel"
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
