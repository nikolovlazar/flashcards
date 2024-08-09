package main

import (
	"api/database"
	"api/routes"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
)

func main() {
	database.ConnectDB()

	app := fiber.New()

	routes.RegisterCategoriesRoutes(app)
	routes.RegisterFlashcardsRoutes(app)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	log.Fatal(app.Listen(fmt.Sprintf(":%v", port)))
}
