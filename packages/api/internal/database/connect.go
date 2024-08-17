package database

import (
	"api/internal/models"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := "host=db user=postgres password=password dbname=flashcards port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatal("❌ Failed to connect to database. \n", err)
	}

	log.Println("✅ connected to postgresql!")
	db.Logger = logger.Default.LogMode(logger.Info)

	DB = db
}

func AutoMigrate() {
	log.Println("🔄 running migrations...")
	DB.AutoMigrate(&models.Category{}, &models.Flashcard{})
}
