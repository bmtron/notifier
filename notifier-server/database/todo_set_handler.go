package database

import (
	"database/sql"
	"log"
	"notifier/models"

	_ "github.com/lib/pq"
)

type TodoSet = models.TodoSet

func CreateTodoSet(todoSet TodoSet, db *sql.DB) (TodoSet, error) {
    query := `
        INSERT INTO todo_set (user_id, title)
        VALUES ($1, $2)
        RETURNING todo_set_id, created_at, updated_at
        `
    err := db.QueryRow(query, todoSet.UserID, todoSet.Title).Scan(&todoSet.TodoSetID, &todoSet.CreatedAt, &todoSet.UpdatedAt)
    if err != nil {
        log.Print(err)
        return todoSet, err
    }

    return todoSet, nil
}

func GetTodoSet(todoSetID int, db *sql.DB) (TodoSet, error) {
    var todoSet TodoSet
    query := `
        SELECT todo_set_id, user_id, title, deleted, created_at, updated_at
        FROM todo_set
        WHERE todo_set_id = $1
        `
    err := db.QueryRow(query, todoSetID).Scan(&todoSet.TodoSetID, &todoSet.UserID, &todoSet.Title, &todoSet.Deleted, &todoSet.CreatedAt, &todoSet.UpdatedAt)
    if err != nil {
        log.Print(err)
        return todoSet, err
    }

    return todoSet, nil
}

func UpdateTodoSet(todoSetID int, updatedTodoSet TodoSet, db *sql.DB) (TodoSet, error) {
    query := `
        UPDATE todo_set
        SET title = $1, updated_at = CURRENT_TIMESTAMP
        WHERE todo_set_id = $2
        RETURNING todo_set_id, title, deleted, created_at, updated_at
        `
    err := db.QueryRow(query, updatedTodoSet.Title, todoSetID).Scan(&updatedTodoSet.TodoSetID, &updatedTodoSet.Title, &updatedTodoSet.Deleted, &updatedTodoSet.CreatedAt, &updatedTodoSet.UpdatedAt)
    if err != nil {
        log.Print(err)
        return updatedTodoSet, err
    }

    return updatedTodoSet, nil
}

func DeleteTodoSet(todoSetID int, db *sql.DB) (string, error) {
    query := `
        UPDATE todo_set
        SET deleted = TRUE, updated_at = CURRENT_TIMESTAMP
        WHERE todo_set_id = $1
        `
    _, err := db.Exec(query, todoSetID)
    if err != nil {
        log.Print(err)
        return "", err
    }

    return "TodoSet deleted successfully", nil
}
