package models

import (
	"time"
)

type User struct {
    UserID      int             `json:"user_id"`
    Username    string          `json:"username"`
    Email       string          `json:"email"`
    Password    string          `json:"password_hash"`
    PlainPassword string        `json:"password"`
    CreatedAt   time.Time       `json:"created_at"`
    UpdatedAt   *time.Time      `json:"updated_at"`
}