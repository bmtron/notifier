package main

import (
	"database/sql"
	"log"
	"net/http"
	"notifier/database"
	"notifier/models"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
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

    // Configure CORS
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"http://localhost:5173"} // Add your frontend URL
    config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
    config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
    router.Use(cors.New(config))

    // Auth
    router.POST("/auth/login", loginHandler)

    // Users
    router.GET("/api/users/:id", getHandler(database.GetUser))
    router.POST("/api/users", createHandler(database.CreateUser))
    router.PUT("/api/users/:id", updateHandler(database.UpdateUser))
    router.DELETE("/api/users/:id", deleteHandler(database.DeleteUser))

    // Notes
    router.GET("/api/notes/:id", getHandler(database.GetNote))
    router.POST("/api/notes", createHandler(database.CreateNote))
    router.PUT("/api/notes/:id", updateHandler(database.UpdateNote))
    router.DELETE("/api/notes/:id", deleteHandler(database.DeleteNote))

    // Todo Sets
    router.GET("/api/todo_sets/:id", getHandler(database.GetTodoSet))
    router.POST("/api/todo_sets", createHandler(database.CreateTodoSet))
    router.PUT("/api/todo_sets/:id", updateHandler(database.UpdateTodoSet))
    router.DELETE("/api/todo_sets/:id", deleteHandler(database.DeleteTodoSet))

    // Todo Items
    router.GET("/api/todo_items/:id", getHandler(database.GetTodoItem))
    router.POST("/api/todo_items", createHandler(database.CreateTodoItem))
    router.PUT("/api/todo_items/:id", updateHandler(database.UpdateTodoItem))
    router.DELETE("/api/todo_items/:id", deleteHandler(database.DeleteTodoItem))


    router.Run("0.0.0.0:8008")
}

func loginHandler(c *gin.Context) {
    var loginRequest struct {
        Email    string `json:"email" binding:"required,email"`
        Password string `json:"password" binding:"required"`
    }

    if err := c.ShouldBindJSON(&loginRequest); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
        return
    }

    user, err := database.GetUserByEmail(loginRequest.Email, db)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "User not found"})
        return
    }
    
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginRequest.Password)); err != nil {
        log.Printf("Password comparison failed with error: %v", err)
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
        return
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": user.UserID,
        "exp": time.Now().Add(time.Hour * 24).Unix(),
    })  

    tokenString, err := token.SignedString([]byte("your-256-bit-secret"))
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"token": tokenString, "user": user})
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
