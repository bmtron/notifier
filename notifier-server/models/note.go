package models

import (
	"time"
)

type Note struct {
    NoteID    int       `json:"note_id"`
    UserID    int       `json:"user_id"`
    Title     string    `json:"title"`
    Content   string    `json:"content"`
    Deleted   bool      `json:"deleted"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt *time.Time `json:"updated_at"`
}