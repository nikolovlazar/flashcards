package services

import (
	"api/internal/database"
	errs "api/internal/errors"
	"api/internal/models"

	"github.com/gosimple/slug"
)

func GetFlashcards() ([]models.Flashcard, error) {
	var flashcards []models.Flashcard

	result := database.DB.Find(&flashcards)

	if result.Error != nil {
		return nil, &errs.OperationError{Operation: "retrieve", Resource: "categories"}
	}

	return flashcards, nil
}

func CreateFlashcard(input struct {
	Question string
	Answer   string
	Category uint
},
) (*models.Flashcard, error) {
	var existingCategory models.Category
	existingCategoryResult := database.DB.First(&existingCategory, input.Category)

	if existingCategoryResult.Error != nil {
		return nil, &errs.NotFoundError{Resource: "category"}
	}

	slug := slug.Make(input.Question)

	newFlashcard := &models.Flashcard{
		Question:   input.Question,
		Answer:     input.Answer,
		Slug:       slug,
		CategoryID: input.Category,
	}

	if err := database.DB.Create(newFlashcard).Error; err != nil {
		return nil, &errs.OperationError{Operation: "create", Resource: "flashcard"}
	}

	return newFlashcard, nil
}

func UpdateFlashcard(flashcardId string, input struct {
	Question *string
	Answer   *string
	Category *uint
},
) (*models.Flashcard, error) {
	var existingFlashcard models.Flashcard
	existingFlashcardResult := database.DB.First(&existingFlashcard, flashcardId)

	if existingFlashcardResult.Error != nil {
		return nil, &errs.NotFoundError{Resource: "flashcard"}
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
			return nil, &errs.NotFoundError{Resource: "category"}
		}
		updatedFlashcard.CategoryID = *input.Category
	}

	if err := database.DB.Save(&updatedFlashcard).Error; err != nil {
		return nil, &errs.OperationError{Operation: "update", Resource: "flashcard"}
	}

	return &updatedFlashcard, nil
}

func DeleteFlashcard(flashcardId string) (bool, error) {
	var existingFlashcard models.Flashcard
	existingResult := database.DB.First(&existingFlashcard, flashcardId)

	if existingResult.Error != nil {
		return false, &errs.NotFoundError{Resource: "Flashcard"}
	}

	if err := database.DB.Delete(&existingFlashcard).Error; err != nil {
		return false, &errs.OperationError{Operation: "delete", Resource: "flashcard"}
	}

	return true, nil
}
