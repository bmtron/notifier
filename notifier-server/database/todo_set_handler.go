package database

import (
	"database/sql"
	"log"
	"notifier/models"

	_ "github.com/lib/pq"
)

type TodoSet = models.TodoSet
type TodoSetWithItems = models.TodoSetWithItems


func CreateTodoSet(todoSet TodoSet, db *sql.DB) (TodoSet, error) {
    query := `
        INSERT INTO todo_set (user_id, title)
        VALUES ($1, $2)
        RETURNING todo_set_id, user_id, title, created_at, updated_at
        `
    err := db.QueryRow(query, todoSet.UserIDFromJson, todoSet.Title).Scan(&todoSet.TodoSetID, &todoSet.UserID, &todoSet.Title, &todoSet.CreatedAt, &todoSet.UpdatedAt)
    if err != nil {
        log.Print(err)
        return todoSet, err
    }

    return todoSet, nil
}

func GetAllTodoSetsAndItemsForUser(userID int, db *sql.DB) ([]TodoSetWithItems, error) {
    query := `
        SELECT ts.todo_set_id, ts.user_id, ts.title, ts.archived, ts.deleted, ts.created_at, ts.updated_at, ts.display_order,
               ti.todo_item_id, ti.todo_set_id, ti.content, ti.completed, ti.deleted, ti.created_at, ti.updated_at
        FROM todo_set ts
        LEFT JOIN todo_item ti ON ts.todo_set_id = ti.todo_set_id
        WHERE ts.user_id = $1
        ORDER BY ts.display_order DESC, ti.todo_item_id ASC
        `
    rows, err := db.Query(query, userID)
    if err != nil {
        log.Print(err)
        return nil, err
    }
    
    defer rows.Close()

    // Map to store todo sets with their items
    todoSetMap := make(map[int]TodoSetWithItems)
    
    for rows.Next() {
        var todoSet TodoSet
        var todoItem TodoItem
        var todoItemID sql.NullInt64
        var todoItemContent sql.NullString
        var todoItemCompleted sql.NullBool
        var todoItemDeleted sql.NullBool
        var todoItemCreatedAt sql.NullTime
        var todoItemUpdatedAt sql.NullTime

        err := rows.Scan(
            &todoSet.TodoSetID, &todoSet.UserID, &todoSet.Title, &todoSet.Archived, &todoSet.Deleted, &todoSet.CreatedAt, &todoSet.UpdatedAt, &todoSet.DisplayOrder,
            &todoItemID, &todoItem.TodoSetID, &todoItemContent, &todoItemCompleted, &todoItemDeleted, &todoItemCreatedAt, &todoItemUpdatedAt,
        )
        if err != nil {
            log.Print(err)
            return nil, err
        }

        // If this todo set doesn't exist in our map yet, add it
        if _, exists := todoSetMap[todoSet.TodoSetID]; !exists {
            todoSetMap[todoSet.TodoSetID] = TodoSetWithItems{
                TodoSet: todoSet,
                Items:   make([]TodoItem, 0),
            }
        }

        // If we have a valid todo item (not NULL), add it to the todo set's items
        if todoItemID.Valid {
            id := int(todoItemID.Int64)
            todoItem.TodoItemID = &id
            todoItem.Content = &todoItemContent.String
            todoItem.Completed = &todoItemCompleted.Bool
            todoItem.Deleted = &todoItemDeleted.Bool
            todoItem.CreatedAt = &todoItemCreatedAt.Time
            todoItem.UpdatedAt = &todoItemUpdatedAt.Time
            
            todoSetWithItems := todoSetMap[todoSet.TodoSetID]
            todoSetWithItems.Items = append(todoSetWithItems.Items, todoItem)
            todoSetMap[todoSet.TodoSetID] = todoSetWithItems
        }
    }

    // Convert map to slice
    result := make([]TodoSetWithItems, 0, len(todoSetMap))
    for _, todoSetWithItems := range todoSetMap {
        result = append(result, todoSetWithItems)
    }
    
    return result, nil
}   

func GetTodoSet(todoSetID int, db *sql.DB) (TodoSet, error) {
    var todoSet TodoSet
    query := `
        SELECT todo_set_id, user_id, title, archived, deleted, created_at, updated_at, display_order
        FROM todo_set
        WHERE todo_set_id = $1
        `
    err := db.QueryRow(query, todoSetID).Scan(&todoSet.TodoSetID, &todoSet.UserID, &todoSet.Title, &todoSet.Archived, &todoSet.Deleted, &todoSet.CreatedAt, &todoSet.UpdatedAt, &todoSet.DisplayOrder)
    if err != nil {
        log.Print(err)
        return todoSet, err
    }

    return todoSet, nil
}

func UpdateTodoSet(todoSetID int, updatedTodoSet TodoSet, db *sql.DB) (TodoSet, error) {
    query := `
        UPDATE todo_set
        SET title = $1, archived = $2, updated_at = CURRENT_TIMESTAMP
        WHERE todo_set_id = $3
        RETURNING todo_set_id, title, archived, deleted, created_at, updated_at, display_order
        `
    err := db.QueryRow(query, updatedTodoSet.Title, updatedTodoSet.Archived, todoSetID).Scan(&updatedTodoSet.TodoSetID, &updatedTodoSet.Title, &updatedTodoSet.Archived, &updatedTodoSet.Deleted, &updatedTodoSet.CreatedAt, &updatedTodoSet.UpdatedAt, &updatedTodoSet.DisplayOrder)
    if err != nil {
        log.Print(err)
        return updatedTodoSet, err
    }

    return updatedTodoSet, nil
}

func UpdateTodoSetBatch(todoSetBatch []TodoSet, db *sql.DB) ([]TodoSet, error) {

    todoSetBatchResults := make([]TodoSet, 0)
    
    for _, todoSet := range todoSetBatch {
        log.Print(todoSet.DisplayOrderFromJson)
        query := `
            UPDATE todo_set
            SET title = $1, archived = $2, display_order = $3, updated_at = CURRENT_TIMESTAMP
            WHERE todo_set_id = $4
            RETURNING todo_set_id, title, archived, deleted, created_at, updated_at, display_order
            `
        log.Print(query)
        err := db.QueryRow(query, todoSet.Title, todoSet.Archived, todoSet.DisplayOrderFromJson, todoSet.TodoSetIDFromJson).Scan(&todoSet.TodoSetID, &todoSet.Title, &todoSet.Archived, &todoSet.Deleted, &todoSet.CreatedAt, &todoSet.UpdatedAt, &todoSet.DisplayOrder)
        log.Print(todoSet.DisplayOrder)
        if err != nil {
            log.Print(err)
            return todoSetBatchResults, err
        }
        todoSetBatchResults = append(todoSetBatchResults, todoSet)
    }
    return todoSetBatchResults, nil
}   

func DeleteTodoSet(todoSetID int, db *sql.DB) (TodoSet, error) {
    query := `
        UPDATE todo_set
        SET deleted = TRUE, updated_at = CURRENT_TIMESTAMP
        WHERE todo_set_id = $1
        RETURNING todo_set_id, user_id, title, archived, deleted, created_at, updated_at
        `
    var deletedTodoSet TodoSet
    err := db.QueryRow(query, todoSetID).Scan(&deletedTodoSet.TodoSetID, &deletedTodoSet.UserID, &deletedTodoSet.Title, &deletedTodoSet.Archived, &deletedTodoSet.Deleted, &deletedTodoSet.CreatedAt, &deletedTodoSet.UpdatedAt)
    if err != nil {
        log.Print(err)
        return deletedTodoSet, err
    }

    return deletedTodoSet, nil
}
