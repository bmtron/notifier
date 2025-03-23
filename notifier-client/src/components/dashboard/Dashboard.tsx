import { useState } from 'react'

import styles from './Dashboard.module.css'
import { QuickTodos } from './helpers/QuickTodos'
interface Note {
  id: number
  title: string
  content: string
  lastModified: Date
}

interface Reminder {
  id: number
  title: string
  dueDate: Date
  completed: boolean
}

const Dashboard = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: 'Meeting Notes',
      content: 'Discussion points from the team sync...',
      lastModified: new Date(),
    },
    {
      id: 2,
      title: 'Ideas',
      content: 'New feature ideas for the next sprint...',
      lastModified: new Date(),
    },
  ])

  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 1,
      title: 'Client Meeting',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      completed: false,
    },
    {
      id: 2,
      title: 'Project Deadline',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      completed: false,
    },
  ])

  const showTodoModal = () => {
    // TODO: Implement Todo Modal...maybe?
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>My Dashboard</h1>
        <div className={styles.userInfo}>
          <span className={styles.welcome}>Welcome back!</span>
          <button className={styles.profileButton}>Profile</button>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Quick Actions */}
        <section className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <div className={styles.actionButtons}>
            <button className={styles.actionButton}>New Note</button>
            <button
              className={styles.actionButton}
              onClick={() => {
                showTodoModal()
              }}
            >
              Add Todo
            </button>
            <button className={styles.actionButton}>Set Reminder</button>
          </div>
        </section>

        {/* To-Do List */}
        {/* If the user has their own todo items, show that, otherwise show the default todos */}
        <section className={styles.todoSection}>
          <QuickTodos />
        </section>

        {/* Recent Notes */}
        {/* TODO: Implement QuickNotes similar to QuickTodos */}
        <section className={styles.notesSection}>
          <h2>Recent Notes</h2>
          <div className={styles.notesList}>
            {notes.map((note) => (
              <div key={note.id} className={styles.noteCard}>
                <h3>{note.title}</h3>
                <p>{note.content.substring(0, 100)}...</p>
                <span className={styles.timestamp}>
                  Last modified: {note.lastModified.toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Reminders */}
        <section className={styles.remindersSection}>
          <h2>Upcoming Reminders</h2>
          <div className={styles.remindersList}>
            {reminders.map((reminder) => (
              <div key={reminder.id} className={styles.reminderCard}>
                <h3>{reminder.title}</h3>
                <p>Due: {reminder.dueDate.toLocaleDateString()}</p>
                <div className={styles.reminderActions}>
                  <button className={styles.completeButton}>
                    {reminder.completed ? 'Completed' : 'Mark Complete'}
                  </button>
                  <button className={styles.editButton}>Edit</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
