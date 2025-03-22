package models

import (
	"time"
)

type TodoItem struct {
    TodoItemID *int         `json:"todo_item_id"`
    TodoSetID  *int         `json:"todo_set_id"`
    Content    *string      `json:"content"`
    Completed  *bool        `json:"completed"`
    Deleted    *bool        `json:"deleted"`
    CreatedAt  *time.Time   `json:"created_at"`
    UpdatedAt  *time.Time   `json:"updated_at"`
    TodoSetIdFromJson *int  `json:"TodoSetId"`
}
