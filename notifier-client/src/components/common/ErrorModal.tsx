import styles from './ErrorModal.module.css';

interface ErrorProps {
  message: string;
  title: string;
  hideModal: () => void;
  okHandler?: () => void;
  cancelHandler?: () => void;
}

export const ErrorModal = ({ message, title, okHandler, hideModal, cancelHandler }: ErrorProps) => {
  let cancelAction = hideModal;
  if (cancelHandler) {
    cancelAction = cancelHandler;
  }
  return (
    <>
      <div
        className={styles.modalOverlay}
        onClick={cancelAction}
        onKeyDown={(e) => {
          if (e.key === 'Escape') cancelAction();
        }}
        tabIndex={0}
        role='dialog'
        aria-modal='true'
      >
        <div
          className={styles.modal}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>{title}</h2>
            <button className={styles.modalClose} onClick={cancelAction}>
              ×
            </button>
          </div>
          <div className={styles.modalContent}>{message}</div>
        </div>
      </div>
    </>
  );
};
