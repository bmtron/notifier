package models

import (
	"time"
)

type Reminder struct {
    ReminderID    	int       	`json:"reminder_id"`
    UserID    		int       	`json:"user_id"`
    Title     		string    	`json:"title"`
    Notes  			string    	`json:"notes"`
	Expiration      time.Time 	`json:"expiration"`
	Repeated		bool	  	`json:"repeated"`
	RepeatPattern   string    	`json:"repeat_pattern"`
	Completed		bool      	`json:"completed"`
    Deleted   		bool      	`json:"deleted"`
    CreatedAt 		time.Time 	`json:"created_at"`
    UpdatedAt 		*time.Time 	`json:"updated_at"`
    UserIdFromAPI int     		`json:"userid"`
}