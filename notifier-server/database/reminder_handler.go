package database

import (
	"database/sql"
	"log"

	"notifier/models"

	_ "github.com/lib/pq"
)

type Reminder = models.Reminder

func GetReminder(reminderID int, db *sql.DB) (Reminder, error) {
	var reminder Reminder
	query := `
		SELECT reminder_id, user_id, title, notes, expiration, repeated, repeat_pattern, 
			   completed, deleted, created_at, updated_at
		FROM reminders
		WHERE reminder_id = $1
		`
	err := db.QueryRow(query, reminderID).Scan(
		&reminder.ReminderID, &reminder.UserID, &reminder.Title, &reminder.Notes,
		&reminder.Expiration, &reminder.Repeated, &reminder.RepeatPattern,
		&reminder.Completed, &reminder.Deleted, &reminder.CreatedAt, &reminder.UpdatedAt,
	)
	if err != nil {
		log.Print(err)
		return reminder, err
	}

	return reminder, nil
}

func GetRemindersByUserID(userID int, db *sql.DB) ([]Reminder, error) {
	query := `
		SELECT reminder_id, user_id, title, notes, expiration, repeated, repeat_pattern,
			   completed, deleted, created_at, updated_at
		FROM reminders
		WHERE user_id = $1
		`
	rows, err := db.Query(query, userID)
	if err != nil {
		log.Print(err)
		return nil, err
	}
	defer rows.Close()
 
	var reminders []Reminder
	for rows.Next() {
		var reminder Reminder
		err = rows.Scan(
			&reminder.ReminderID, &reminder.UserID, &reminder.Title, &reminder.Notes,
			&reminder.Expiration, &reminder.Repeated, &reminder.RepeatPattern,
			&reminder.Completed, &reminder.Deleted, &reminder.CreatedAt, &reminder.UpdatedAt,
		)
		if err != nil {
			log.Print(err)
			return nil, err
		}
		reminders = append(reminders, reminder)
	}
	return reminders, nil
}

func CreateReminder(reminder Reminder, db *sql.DB) (Reminder, error) {
	log.Print("Creating reminder:", reminder)
	query := `
		INSERT INTO reminders (user_id, title, notes, expiration, repeated, repeat_pattern)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING reminder_id, created_at, updated_at
		`
	err := db.QueryRow(
		query,
		reminder.UserIdFromAPI,
		reminder.Title,
		reminder.Notes,
		reminder.Expiration,
		reminder.Repeated,
		reminder.RepeatPattern,
	).Scan(&reminder.ReminderID, &reminder.CreatedAt, &reminder.UpdatedAt)
	if err != nil {
		log.Print(err)
		return reminder, err
	}

	return reminder, nil
}

func UpdateReminder(reminderID int, updatedReminder Reminder, db *sql.DB) (Reminder, error) {
	query := `
		UPDATE reminders
		SET title = $1, notes = $2, expiration = $3, repeated = $4, 
			repeat_pattern = $5, completed = $6, updated_at = CURRENT_TIMESTAMP
		WHERE reminder_id = $7
		RETURNING reminder_id, user_id, title, notes, expiration, repeated, 
				  repeat_pattern, completed, deleted, created_at, updated_at
		`
	err := db.QueryRow(
		query,
		updatedReminder.Title,
		updatedReminder.Notes,
		updatedReminder.Expiration,
		updatedReminder.Repeated,
		updatedReminder.RepeatPattern,
		updatedReminder.Completed,
		reminderID,
	).Scan(
		&updatedReminder.ReminderID, &updatedReminder.UserID, &updatedReminder.Title,
		&updatedReminder.Notes, &updatedReminder.Expiration, &updatedReminder.Repeated,
		&updatedReminder.RepeatPattern, &updatedReminder.Completed, &updatedReminder.Deleted,
		&updatedReminder.CreatedAt, &updatedReminder.UpdatedAt,
	)
	if err != nil {
		log.Print(err)
		return updatedReminder, err
	}

	return updatedReminder, nil
}

func DeleteReminder(reminderID int, db *sql.DB) (Reminder, error) {
	query := `
		UPDATE reminders
		SET deleted = TRUE, updated_at = CURRENT_TIMESTAMP
		WHERE reminder_id = $1
		RETURNING reminder_id, user_id, title, notes, expiration, repeated,
				  repeat_pattern, completed, deleted, created_at, updated_at
		`
	var deletedReminder Reminder
	err := db.QueryRow(query, reminderID).Scan(
		&deletedReminder.ReminderID, &deletedReminder.UserID, &deletedReminder.Title,
		&deletedReminder.Notes, &deletedReminder.Expiration, &deletedReminder.Repeated,
		&deletedReminder.RepeatPattern, &deletedReminder.Completed, &deletedReminder.Deleted,
		&deletedReminder.CreatedAt, &deletedReminder.UpdatedAt,
	)
	if err != nil {
		log.Print(err)
		return deletedReminder, err
	}

	return deletedReminder, nil
}
