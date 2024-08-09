package routes

import (
	"api/database"
	"api/models"

	"github.com/gofiber/fiber/v2"
	"github.com/gosimple/slug"
)

func RegisterFlashcardsRoutes(app *fiber.App) {
	api := app.Group("/flashcards")

	api.Put("/", createFlashcard)
	api.Post("/:id", updateFlashcard)
	api.Delete("/:id", deleteFlashcard)
}

func createFlashcard(c *fiber.Ctx) error {
	input := struct {
		Question string `json:"question" form:"question"`
		Answer   string `json:"answer" form:"answer"`
		Category uint   `json:"category" form:"category"`
	}{}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).SendString("Bad request. Make sure you're sending the right data.")
	}

	var existingCategory models.Category
	existingCategoryResult := database.DB.First(&existingCategory, input.Category)

	if existingCategoryResult.Error != nil {
		return c.Status(404).SendString("Category not found")
	}

	slug := slug.Make(input.Question)

	newFlashcard := &models.Flashcard{
		Question:   input.Question,
		Answer:     input.Answer,
		Slug:       slug,
		CategoryID: input.Category,
	}

	if err := database.DB.Create(newFlashcard).Error; err != nil {
		return c.Status(500).SendString("Failed to create flashcard: " + err.Error())
	}

	return c.Status(201).JSON(newFlashcard)
}

func updateFlashcard(c *fiber.Ctx) error {
	flashcardId := c.Params("id")

	var existingFlashcard models.Flashcard
	existingFlashcardResult := database.DB.First(&existingFlashcard, flashcardId)

	if existingFlashcardResult.Error != nil {
		return c.Status(404).SendString("Flashcard doesn't exist")
	}

	input := struct {
		Question *string `json:"question,omitempty" form:"question,omitempty"`
		Answer   *string `json:"answer,omitempty" form:"answer,omitempty"`
		Category *uint   `json:"category,omitempty" form:"category,omitempty"`
	}{}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	updatedFlashcard := existingFlashcard

	if input.Question != nil {
		updatedFlashcard.Question = *input.Question
	}

	if input.Answer != nil {
		updatedFlashcard.Answer = *input.Answer
	}

	if input.Category != nil {
		var existingCategory models.Category
		existingCategoryResult := database.DB.First(&existingCategory, input.Category)

		if existingCategoryResult.Error != nil {
			return c.Status(400).SendString("Category not found")
		}
		updatedFlashcard.CategoryID = *input.Category
	}

	if err := database.DB.Save(&updatedFlashcard).Error; err != nil {
		return c.Status(500).SendString("Failed to update flashcard: " + err.Error())
	}

	return c.Status(200).JSON(updatedFlashcard)
}

func deleteFlashcard(c *fiber.Ctx) error {
	flashcardId := c.Params("id")

	var existingFlashcard models.Flashcard
	existingResult := database.DB.First(&existingFlashcard, flashcardId)

	if existingResult.Error != nil {
		return c.Status(404).SendString("Flashcard not found")
	}

	if err := database.DB.Delete(&existingFlashcard).Error; err != nil {
		return c.Status(500).SendString("Failed to delete flashcard: " + err.Error())
	}

	return c.Status(200).JSON(struct{ success bool }{success: true})
}
