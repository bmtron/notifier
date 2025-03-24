package database

import (
	"database/sql"
	"log"
	"notifier/models"

	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

type User = models.User

func CreateUser(user User, db *sql.DB) (User, error) {
    log.Print("USER PASSWORD: ", user.PlainPassword)
    user.Password = password_hasher(user.PlainPassword)
    query := `
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING user_id, created_at, updated_at
        `
        err := db.QueryRow(query, user.Username, user.Email, user.Password).Scan(&user.UserID, &user.CreatedAt, &user.UpdatedAt)
        if err != nil {
            log.Print(err)
            return user, err
        }

    return user, nil
}

func GetUser(userID int, db *sql.DB) (User, error) {
    var user User
    query := `
        SELECT user_id, username, email, password_hash, created_at, updated_at
        FROM users
        WHERE user_id = $1
        `
    err := db.QueryRow(query, userID).Scan(&user.UserID, &user.Username, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt)
    if err != nil {
        log.Print(err)
        return user, err
    }

    return user, nil
}

func GetUserByEmail(email string, db *sql.DB) (User, error) {
    var user User
    query := `
        SELECT user_id, username, email, password_hash, created_at, updated_at
        FROM users
        WHERE email = $1
        `
    err := db.QueryRow(query, email).Scan(&user.UserID, &user.Username, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt)
    if err != nil {
        log.Print(err)
        return user, err
    }

    return user, nil
}

func UpdateUser(userID int, updatedUser User, db *sql.DB) (User, error) {
    updatedUser.Password = password_hasher(updatedUser.Password)
    query := `
        UPDATE users
        SET username = $1, email = $2, password_hash = $3, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $4
        RETURNING user_id, username, email, password_hash, created_at, updated_at
        `
    err := db.QueryRow(query, updatedUser.Username, updatedUser.Email, updatedUser.Password, userID).Scan(&updatedUser.UserID, &updatedUser.Username, &updatedUser.Email, &updatedUser.Password, &updatedUser.CreatedAt, &updatedUser.UpdatedAt)
    if err != nil {
        log.Print(err)
        return updatedUser, err
    }

    return updatedUser, nil
}

func DeleteUser(userID int, db *sql.DB) (User, error){
    query := `
        DELETE FROM users
        WHERE user_id = $1
        RETURNING user_id, username, email, password_hash, created_at, updated_at
        `
    var deletedUser User
    err := db.QueryRow(query, userID).Scan(&deletedUser.UserID, &deletedUser.Username, &deletedUser.Email, &deletedUser.Password, &deletedUser.CreatedAt, &deletedUser.UpdatedAt)
    if err != nil {
        log.Print(err)
        return deletedUser, err
    }

    return deletedUser, nil
}

func password_hasher(password string) string {
    passbytes := []byte(password)

    hashedPassword, err := bcrypt.GenerateFromPassword(passbytes, bcrypt.DefaultCost)
    if err != nil {
        log.Fatal(err)
    }

    // quick sanity check
    err = bcrypt.CompareHashAndPassword(hashedPassword, passbytes)
    if err != nil {
        log.Fatal("PASSWORD_MISMATCH ABORTING")
    }

    return string(hashedPassword)
}
