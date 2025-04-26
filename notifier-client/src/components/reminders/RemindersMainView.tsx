import { useState } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../../context/AuthContext';
import { createReminder } from '../../services/api/createReminder';
import type { Reminder } from '../../utils/models/Reminder';
import { ErrorModal } from '../common/ErrorModal';

import styles from './RemindersMainView.module.css';
import { RemindersModalView } from './RemindersModalView';

export const RemindersMainView = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalTitle, setErrorModalTitle] = useState('');
  const [errorModalContent, setErrorModalContent] = useState('');
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

  const handleSubmit = async (reminder: Reminder) => {
    setReminders([...reminders, reminder]);
    const result = await createReminder(reminder);
    if (!result.success) {
      setShowErrorModal(true);
      setErrorModalTitle('Error Saving Reminder');
      const resultErrorMessage: string = result.error
        ? result.error
        : 'No further details available';
      setErrorModalContent(`Details: ${resultErrorMessage}`);
    } else {
      setNewReminder({
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
    }
  };

  const hideErrorModalHandler = () => {
    setShowErrorModal(false);
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Reminders</h1>
        <button
          onClick={() => {
            setShowModal(true);
          }}
        >
          New Reminder
        </button>
      </div>
      {showModal && (
        <RemindersModalView
          reminders={reminders}
          handleSubmit={handleSubmit}
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          title={errorModalTitle}
          message={errorModalContent}
          hideModal={hideErrorModalHandler}
        />
      )}
      <div className={styles.remindersList}>
        {reminders.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No reminders yet. Create your first one above!</p>
          </div>
        ) : (
          reminders.map((reminder) => (
            <div key={reminder.reminderId} className={styles.reminder}>
              <h3 className={styles.reminderTitle}>{reminder.title}</h3>
              <p className={styles.reminderDescription}>{reminder.notes}</p>
              <p className={styles.reminderDate}>Due: {reminder.expiration.toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
