package models

import (
	"time"
)

type TodoSet struct {
    TodoSetID int       `json:"todo_set_id"`
    UserID    int       `json:"user_id"`
    Title     string    `json:"title"`
    Deleted   bool      `json:"deleted"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt *time.Time `json:"updated_at"`
}