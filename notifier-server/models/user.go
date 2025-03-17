package models

import (
	"time"
)

type User struct {
    UserID      int         `json:"userid"`
    Username    string      `json:"username"`
    Email       string      `json:"email"`
    Password    string      `json:"password_hash"`
    CreatedAt   time.Time   `json:"created_at"`
    UpdatedAt   *time.Time   `json:"updated_at"`
}