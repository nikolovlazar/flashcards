package main

import (
	"api/cmd/routes"
	"api/internal/database"
	"api/scripts/seed"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
)

func main() {
	database.ConnectDB()
	seed.Seed()

	app := fiber.New()

	routes.RegisterCategoriesRoutes(app)
	routes.RegisterFlashcardsRoutes(app)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	log.Fatal(app.Listen(fmt.Sprintf(":%v", port)))
}
