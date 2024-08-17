package main

import (
	"api/cmd/routes"
	"api/internal/database"
	"api/internal/models"
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

	app.Get("/wipe-db", func(c *fiber.Ctx) error {
		database.DB.Migrator().DropTable(&models.Category{})
		database.DB.Migrator().DropTable(&models.Flashcard{})
		return c.Status(200).SendString("DB wiped!")
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	log.Fatal(app.Listen(fmt.Sprintf(":%v", port)))
}
