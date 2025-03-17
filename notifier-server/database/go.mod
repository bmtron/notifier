module notifier/database

go 1.24.1

require (
	github.com/joho/godotenv v1.5.1
	github.com/lib/pq v1.10.9
	golang.org/x/crypto v0.36.0
	notifier/models v0.0.0-00010101000000-000000000000
)

replace notifier/models => ../models
