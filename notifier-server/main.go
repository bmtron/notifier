package main

import (
	"database/sql"
	"log"
	"net/http"
	"notifier/database"
	"notifier/models"
	"strconv"
	"strings"
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

type UserResponse struct {
    ID    int    `json:"id"`
    Email string `json:"email"`
    Name  string `json:"name"`
}

// Add new API key middleware
func apiKeyMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        apiKey := c.GetHeader("X-API-Key")
        // In production, this should be an environment variable
        expectedApiKey := "your-api-key-here"

        if apiKey == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "API key required"})
            c.Abort()
            return
        }

        if apiKey != expectedApiKey {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid API key"})
            c.Abort()
            return
        }

        c.Next()
    }
}

func main() {
    log.Print("Starting up server...")
    db = database.SetupDb()
    router := gin.Default()

    // Configure CORS
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"http://localhost:5173"}
    config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
    config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization", "X-API-Key"}
    router.Use(cors.New(config))

    // Public auth routes (no protection needed)
    router.POST("/auth/login", apiKeyMiddleware(), loginHandler)
    router.GET("/auth/me", apiKeyMiddleware(), authMiddleware(), getUserInfoHandler)

    // Create an API group with both API key and JWT authentication
    api := router.Group("/api")
    api.Use(apiKeyMiddleware(), authMiddleware())
    {
        // Users
        api.GET("/users/:id", getHandler(database.GetUser))
        api.POST("/users", createHandler(database.CreateUser))
        api.PUT("/users/:id", updateHandler(database.UpdateUser))
        api.DELETE("/users/:id", deleteHandler(database.DeleteUser))

        // Notes
        api.GET("/notes/:id", getHandler(database.GetNote))
        api.POST("/notes", createHandler(database.CreateNote))
        api.PUT("/notes/:id", updateHandler(database.UpdateNote))
        api.DELETE("/notes/:id", deleteHandler(database.DeleteNote))

        // Todo Sets
        api.GET("/todo_sets/:id", getHandler(database.GetTodoSet))
        api.POST("/todo_sets", createHandler(database.CreateTodoSet))
        api.PUT("/todo_sets/:id", updateHandler(database.UpdateTodoSet))
        api.DELETE("/todo_sets/:id", deleteHandler(database.DeleteTodoSet))
        api.GET("/todo_sets/user/:id", getTodoSetsHandler)

        // Todo Items
        api.GET("/todo_items/:id", getHandler(database.GetTodoItem))
        api.POST("/todo_items", createHandler(database.CreateTodoItem))
        api.PUT("/todo_items/:id", updateHandler(database.UpdateTodoItem))
        api.DELETE("/todo_items/:id", deleteHandler(database.DeleteTodoItem))
    }

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

    userResponse := UserResponse{
        ID:    user.UserID,
        Email: user.Email,
        Name:  user.Username,
    }

    c.JSON(http.StatusOK, gin.H{
        "token": tokenString,
        "user": userResponse,
    })
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

func authMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
            c.Abort()
            return
        }

        // Extract token from "Bearer <token>"
        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            return []byte("your-256-bit-secret"), nil
        })

        if err != nil || !token.Valid {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        claims, ok := token.Claims.(jwt.MapClaims)
        if !ok {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
            c.Abort()
            return
        }

        userID := int(claims["user_id"].(float64))
        c.Set("user_id", userID)
        c.Next()
    }
}

func getUserInfoHandler(c *gin.Context) {
    userID := c.GetInt("user_id")
    user, err := database.GetUser(userID, db)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
        return
    }

    userResponse := UserResponse{
        ID:    user.UserID,
        Email: user.Email,
        Name:  user.Username,
    }

    c.JSON(http.StatusOK, userResponse)
}

func getTodoSetsHandler(c *gin.Context) {
    userID := c.GetInt("user_id")
    todoSets, err := database.GetAllTodoSetsAndItemsForUser(userID, db)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch todo sets"})
        return
    }

    c.JSON(http.StatusOK, todoSets)
}