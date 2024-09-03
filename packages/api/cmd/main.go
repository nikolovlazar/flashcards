package main

import (
	"api/cmd/routes"
	"api/internal/database"
	"api/internal/models"
	"api/scripts/seed"
	"fmt"
	"log"
	"os"

	"github.com/getsentry/sentry-go"
	sentryfiber "github.com/getsentry/sentry-go/fiber"
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

	if err := sentry.Init(sentry.ClientOptions{
		Dsn:              "https://cf0c3bc46daff2e1ff4679ca3d044cc0@o4506044970565632.ingest.us.sentry.io/4507862240133120",
		TracesSampleRate: 1.0,
	}); err != nil {
		fmt.Printf("Sentry initialization failed: %v\n", err)
	}

	sentryHandler := sentryfiber.New(sentryfiber.Options{
		Repanic:         true,
		WaitForDelivery: true,
	})

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))
	app.Use(sentryHandler)

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
