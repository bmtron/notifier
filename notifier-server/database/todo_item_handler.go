package database

import (
	"database/sql"
	"log"
	"notifier/models"

	_ "github.com/lib/pq"
)

type TodoItem = models.TodoItem

func CreateTodoItem(todoItem TodoItem, db *sql.DB) (TodoItem, error) {
    query := `
        INSERT INTO todo_item (todo_set_id, content)
        VALUES ($1, $2)
        RETURNING todo_item_id, created_at, updated_at
        `
    err := db.QueryRow(query, todoItem.TodoSetID, todoItem.Content).Scan(&todoItem.TodoItemID, &todoItem.CreatedAt, &todoItem.UpdatedAt)
    if err != nil {
        log.Print(err)
        return todoItem, err
    }

    return todoItem, nil
}

func GetTodoItem(todoItemID int, db *sql.DB) (TodoItem, error) {
    var todoItem TodoItem
    query := `
        SELECT todo_item_id, todo_set_id, content, completed, deleted, created_at, updated_at
        FROM todo_item
        WHERE todo_item_id = $1
        `
    err := db.QueryRow(query, todoItemID).Scan(&todoItem.TodoItemID, &todoItem.TodoSetID, &todoItem.Content, &todoItem.Completed, &todoItem.Deleted, &todoItem.CreatedAt, &todoItem.UpdatedAt)
    if err != nil {
        log.Print(err)
        return todoItem, err
    }

    return todoItem, nil
}

func UpdateTodoItem(todoItemID int, updatedTodoItem TodoItem, db *sql.DB) (TodoItem, error) {
    query := `
        UPDATE todo_item
        SET content = $1, completed = $2, updated_at = CURRENT_TIMESTAMP
        WHERE todo_item_id = $3
        RETURNING todo_item_id, content, completed, deleted, created_at, updated_at
        `
    err := db.QueryRow(query, updatedTodoItem.Content, updatedTodoItem.Completed, todoItemID).Scan(&updatedTodoItem.TodoItemID, &updatedTodoItem.Content, &updatedTodoItem.Completed, &updatedTodoItem.Deleted, &updatedTodoItem.CreatedAt, &updatedTodoItem.UpdatedAt)
    if err != nil {
        log.Print(err)
        return updatedTodoItem, err
    }

    return updatedTodoItem, nil
}

func DeleteTodoItem(todoItemID int, db *sql.DB) (string, error) {
    query := `
        UPDATE todo_item
        SET deleted = TRUE, updated_at = CURRENT_TIMESTAMP
        WHERE todo_item_id = $1
        `
    _, err := db.Exec(query, todoItemID)
    if err != nil {
        log.Print(err)
        return "", err
    }

    return "TodoItem deleted successfully", nil
}
