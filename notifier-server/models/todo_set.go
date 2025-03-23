package models

import (
	"time"
)

type TodoSet struct {
    TodoSetID int       `json:"todo_set_id"`
    UserID    int       `json:"user_id"`
    Title     string    `json:"title"`
    Archived  bool      `json:"archived"`
    Deleted   bool      `json:"deleted"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt *time.Time `json:"updated_at"`
    DisplayOrder int    `json:"display_order"`
    UserIDFromJson int `json:"userid"`
    TodoSetIDFromJson int `json:"todosetid"`
    DisplayOrderFromJson int `json:"displayorder"`
}

type TodoSetWithItems struct {
    TodoSet
    Items []TodoItem `json:"items"`
}
