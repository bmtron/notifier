package database

import (
	"database/sql"
	"log"

	"notifier/models"

	_ "github.com/lib/pq"
)

type Note = models.Note


func GetNote(noteID int, db *sql.DB) (Note, error) {
    var note Note
    query := `
        SELECT note_id, user_id, title, content, deleted, created_at, updated_at
        FROM notes
        WHERE note_id = $1
        `
    err := db.QueryRow(query, noteID).Scan(&note.NoteID, &note.UserID, &note.Title, &note.Content, &note.Deleted, &note.CreatedAt, &note.UpdatedAt)
    if err != nil {
        log.Print(err)
        return note, err
    }

    return note, nil
}

func GetNotesByUserID(userID int, db *sql.DB) ([]Note, error) {
    query := `
        SELECT note_id, user_id, title, content, deleted, created_at, updated_at
        FROM notes
        WHERE user_id = $1
        `
    rows, err := db.Query(query, userID)
    if err != nil {
        log.Print(err)
        return nil, err
    }
    defer rows.Close()

    var notes []Note
    for rows.Next() {
        var note Note
        err = rows.Scan(&note.NoteID, &note.UserID, &note.Title, &note.Content, &note.Deleted, &note.CreatedAt, &note.UpdatedAt)
        if err != nil {
            log.Print(err)
            return nil, err
        }
        notes = append(notes, note)
    }
    return notes, nil
}


func CreateNote(note Note, db *sql.DB) (Note, error) {
    log.Print("Creating note:", note)
    query := `
        INSERT INTO notes (user_id, title, content)
        VALUES ($1, $2, $3)
        RETURNING note_id, created_at, updated_at
        `
    err := db.QueryRow(query, note.UserIdFromAPI, note.Title, note.Content).Scan(&note.NoteID, &note.CreatedAt, &note.UpdatedAt)
    if err != nil {
        log.Print(err)
        return note, err
    }

    return note, nil
}

func UpdateNote(noteID int, updatedNote Note, db *sql.DB) (Note, error) {
    query := `
        UPDATE notes
        SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP
        WHERE note_id = $3
        RETURNING note_id, title, content, deleted, created_at, updated_at
        `
    err := db.QueryRow(query, updatedNote.Title, updatedNote.Content, noteID).Scan(&updatedNote.NoteID, &updatedNote.Title, &updatedNote.Content, &updatedNote.Deleted, &updatedNote.CreatedAt, &updatedNote.UpdatedAt)
    if err != nil {
        log.Print(err)
        return updatedNote, err
    }

    return updatedNote, nil
}

func DeleteNote(noteID int, db *sql.DB) (string, error) {
    query := `
        UPDATE notes
        SET deleted = TRUE, updated_at = CURRENT_TIMESTAMP
        WHERE note_id = $1
        `
    _, err := db.Exec(query, noteID)
    if err != nil {
        log.Print(err)
        return "", err
    }

    return "Note deleted successfully", nil
}
