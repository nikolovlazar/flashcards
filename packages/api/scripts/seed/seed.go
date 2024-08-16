package seed

import (
	"api/internal/database"
	"api/internal/models"
	"log"
	"math/rand"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/gosimple/slug"
)

func Seed() {
	log.Println("🌱 seeding database...")

	log.Println("🔄 creating categories...")
	categories := make([]models.Category, 40)
	for range make([]uint8, 40) {
		name := gofakeit.Company()
		category := models.Category{
			Name: name,
			Slug: slug.Make(name),
		}
		categories = append(categories, category)
	}
	database.DB.Create(&categories)

	log.Println("🔄 creating flashcards...")
	flashcards := make([]models.Flashcard, 250)
	for range make([]uint8, 250) {
		question := gofakeit.ProductName()
		flashcard := models.Flashcard{
			Question:   question,
			Answer:     gofakeit.ProductCategory(),
			Slug:       slug.Make(question),
			CategoryID: uint(1 + rand.Intn(39)),
		}
		flashcards = append(flashcards, flashcard)
	}
	database.DB.Create(&flashcards)
}
