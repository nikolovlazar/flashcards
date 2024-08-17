package services

import (
	"api/internal/database"
	errs "api/internal/errors"
	"api/internal/models"

	"github.com/gosimple/slug"
)

func GetCategory(categoryId string) (*models.Category, error) {
	var category models.Category

	result := database.DB.First(&category, categoryId)

	if result.Error != nil {
		return nil, result.Error
	}

	return &category, nil
}

func GetCategories() ([]models.Category, error) {
	var categories []models.Category

	result := database.DB.Find(&categories)

	if result.Error != nil {
		return nil, result.Error
	}

	return categories, nil
}

func CreateCategory(input struct {
	Name string
},
) (*models.Category, error) {
	slug := slug.Make(input.Name)

	var existingCategory models.Category
	result := database.DB.Where("slug = ?", slug).First(&existingCategory)

	if result.Error == nil {
		return nil, &errs.OperationError{Operation: "create", Resource: "category"}
	}

	newCategory := models.Category{
		Name: input.Name,
		Slug: slug,
	}

	database.DB.Create(&newCategory)

	return &newCategory, nil
}

func UpdateCategory(categoryId string, input struct {
	Name string
},
) (*models.Category, error) {
	if len(input.Name) < 5 {
		return nil, &errs.InputParseError{Field: "name", Condition: "must be at least 5 characters"}
	}

	var existingCategory models.Category
	result := database.DB.First(&existingCategory, categoryId)

	if result.Error != nil {
		return nil, &errs.NotFoundError{Resource: "category"}
	}

	slug := slug.Make(input.Name)

	updatedCategory := existingCategory
	updatedCategory.Name = input.Name
	updatedCategory.Slug = slug

	if err := database.DB.Save(&updatedCategory).Error; err != nil {
		return nil, &errs.OperationError{Resource: "category", Operation: "update"}
	}

	return &updatedCategory, nil
}

func DeleteCategory(categoryId string) (bool, error) {
	var existingCategory models.Category
	existingResult := database.DB.First(&existingCategory, categoryId)

	if existingResult.Error != nil {
		return false, &errs.NotFoundError{Resource: "category"}
	}

	var flashcards []models.Flashcard
	findResult := database.DB.Where("category_id = ?", categoryId).Find(&flashcards)

	if findResult.Error != nil {
		return false, &errs.OperationError{Operation: "retrieve", Resource: "category"}
	}

	return true, nil
}

func GetFlashcardsForCategory(categoryId string) ([]models.Flashcard, error) {
	var existingCategory models.Category
	existingResult := database.DB.First(&existingCategory, categoryId)

	if existingResult.Error != nil {
		return nil, &errs.NotFoundError{Resource: "category"}
	}

	var flashcards []models.Flashcard
	findResult := database.DB.Where("category_id = ?", categoryId).Find(&flashcards)

	if findResult.Error != nil {
		return nil, &errs.OperationError{Operation: "retrieve", Resource: "category"}
	}

	return flashcards, nil
}
