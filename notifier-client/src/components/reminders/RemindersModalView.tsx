import { useState } from 'react';
import DatePicker from 'react-datepicker';

import type { Reminder } from '../../utils/models/Reminder';

import styles from './RemindersMainView.module.css';

interface RemindersModalViewProps {
  reminders: Reminder[];
  handleSubmit: (reminder: Reminder) => void;
  onClose: () => void;
}

export const RemindersModalView = ({
  reminders,
  handleSubmit,
  onClose,
}: RemindersModalViewProps) => {
  const [remindersProps, setRemindersProps] = useState<Reminder[]>(reminders);
  const [newReminder, setNewReminder] = useState<Reminder>({
    reminderId: null,
    userId: 0,
    title: '',
    notes: '',
    expiration: new Date(),
    repeated: false,
    repeatPattern: '',
    completed: false,
    deleted: false,
    createdAt: null,
    updatedAt: null,
  });

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
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
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Create New Reminder</h2>
          <button className={styles.modalClose} onClick={onClose}>
            ×
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(newReminder);
            onClose();
          }}
        >
          <div className={styles.formGroup}>
            <label htmlFor='title' className={styles.label}>
              Title
            </label>
            <input
              type='text'
              id='title'
              value={newReminder.title}
              onChange={(e) => {
                setNewReminder({ ...newReminder, title: e.target.value });
              }}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='description' className={styles.label}>
              Description
            </label>
            <textarea
              id='description'
              value={newReminder.notes}
              onChange={(e) => {
                setNewReminder({ ...newReminder, notes: e.target.value });
              }}
              className={styles.textarea}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='date' className={styles.label}>
              Date and Time
            </label>
            <DatePicker
              selected={newReminder.expiration}
              onChange={(date: Date | null) => {
                setNewReminder({ ...newReminder, expiration: date || new Date() });
              }}
              showTimeSelect
              dateFormat='MMMM d, yyyy h:mm aa'
              className={styles.input}
            />
          </div>

          <div className={styles.modalFooter}>
            <button type='button' onClick={onClose} className={styles.modalButtonSecondary}>
              Cancel
            </button>
            <button type='submit' className={styles.modalButtonPrimary}>
              Create Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
