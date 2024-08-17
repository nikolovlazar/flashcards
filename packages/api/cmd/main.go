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
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	database.ConnectDB()
	tables, err := database.DB.Migrator().GetTables()
	database.AutoMigrate()
	if err != nil || len(tables) == 0 {
		seed.Seed()
	}

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

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
