package main

import (
	"database/sql"
	"log"
	"net/http"
	"notifier/database"
	"notifier/models"
	"strconv"

	"github.com/gin-gonic/gin"
)
var db *sql.DB

type (
    User = models.User
    Note = models.Note
    TodoItem = models.TodoItem
    TodoSet = models.TodoSet
)

func main() {
    log.Print("Starting up server...")
    db = database.SetupDb()
    router := gin.Default()

    // Users
    router.GET("/users/:id", getHandler(database.GetUser))
    router.POST("/users", createHandler(database.CreateUser))
    router.PUT("/users/:id", updateHandler(database.UpdateUser))
    router.DELETE("/users/:id", deleteHandler(database.DeleteUser))

    // Notes
    router.GET("/notes/:id", getHandler(database.GetNote))
    router.POST("/notes", createHandler(database.CreateNote))
    router.PUT("/notes/:id", updateHandler(database.UpdateNote))
    router.DELETE("/notes/:id", deleteHandler(database.DeleteNote))

    // Todo Sets
    router.GET("/todo_sets/:id", getHandler(database.GetTodoSet))
    router.POST("/todo_sets", createHandler(database.CreateTodoSet))
    router.PUT("/todo_sets/:id", updateHandler(database.UpdateTodoSet))
    router.DELETE("/todo_sets/:id", deleteHandler(database.DeleteTodoSet))

    // Todo Items
    router.GET("/todo_items/:id", getHandler(database.GetTodoItem))
    router.POST("/todo_items", createHandler(database.CreateTodoItem))
    router.PUT("/todo_items/:id", updateHandler(database.UpdateTodoItem))
    router.DELETE("/todo_items/:id", deleteHandler(database.DeleteTodoItem))


    router.Run("0.0.0.0:8008")
}

func deleteHandler(deleteFunc func(itemId int, db *sql.DB) (string, error)) gin.HandlerFunc {
    return func(c *gin.Context) {
        itemId := c.Param("id")
        itemIdInt, err := strconv.Atoi(itemId)
        
        if err != nil {
            log.Print(err)
            c.IndentedJSON(http.StatusBadRequest, err)
            return
        }
        value, dbErr := deleteFunc(itemIdInt, db)
        if (dbErr != nil) {
            log.Print(dbErr)
            c.IndentedJSON(http.StatusInternalServerError, dbErr)
            return
        }
       
        c.IndentedJSON(http.StatusOK, gin.H{"message": value})
    }
}

func createHandler[T any](createFunc func(model T, db *sql.DB) (T, error)) gin.HandlerFunc {
    	return func(c *gin.Context) {
        var model T
		if err := c.BindJSON(&model); err != nil {
			log.Print(err)
			c.IndentedJSON(http.StatusInternalServerError, err)
			return
		}

		result, dbErr := createFunc(model, db)
		if dbErr != nil {
			log.Print(dbErr)
			c.IndentedJSON(http.StatusInternalServerError, dbErr)
			return
		}

		c.IndentedJSON(http.StatusCreated, result)
	}
}

func getHandler[T any](getFunc func(id int, db *sql.DB) (T, error)) gin.HandlerFunc {
    return func(c *gin.Context) {
        itemId := c.Param("id")
        itemIdInt, err := strconv.Atoi(itemId)
        if err != nil {
            log.Print(err)
            c.IndentedJSON(http.StatusBadRequest, err)
            return
        }
        item, dbErr := getFunc(itemIdInt, db)
        if dbErr != nil {
            log.Print(dbErr)
            c.IndentedJSON(http.StatusInternalServerError, dbErr)
            return
        }
        c.IndentedJSON(http.StatusOK, item)
    }
}

func updateHandler[T any](updateFunc func(id int, model T, db *sql.DB) (T, error)) gin.HandlerFunc {
    return func(c *gin.Context) {
            itemId := c.Param("id")
            itemIdInt, err := strconv.Atoi(itemId)
            if err != nil {
                log.Print(err)
                c.IndentedJSON(http.StatusBadRequest, err)
                return
            }
        
            var updatedItem T
            if err := c.BindJSON(&updatedItem); err != nil {
                log.Print(err)
                c.IndentedJSON(http.StatusInternalServerError, err)
                return
            }
        
            todoSet, dbErr := updateFunc(itemIdInt, updatedItem, db)
            if dbErr != nil {
                log.Print(dbErr)
                c.IndentedJSON(http.StatusInternalServerError, dbErr)
                return
            }
            
            c.IndentedJSON(http.StatusOK, todoSet)
    }
}
