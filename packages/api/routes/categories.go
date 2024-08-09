package routes

import (
	"api/database"
	"api/models"

	"github.com/gofiber/fiber/v2"
	"github.com/gosimple/slug"
)

func RegisterCategoriesRoutes(app *fiber.App) {
	api := app.Group("/categories")

	api.Get("/", getCategories)
	api.Put("/", createCategory)
	api.Post("/:id", updateCategory)
	api.Delete("/:id", deleteCategory)
	api.Get("/:id/flashcards", getFlashcardsForCategory)
}

func getCategories(c *fiber.Ctx) error {
	var categories []models.Category

	result := database.DB.Find(&categories)

	if result.Error != nil {
		return c.Status(500).SendString("Cannot retrieve categories: " + result.Error.Error())
	}

	return c.Status(200).JSON(categories)
}

func createCategory(c *fiber.Ctx) error {
	input := struct {
		Name string `json:"name" form:"name"`
	}{}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	if len(input.Name) < 5 {
		return c.Status(400).SendString("Name must be at least 5 characters")
	}

	slug := slug.Make(input.Name)

	var existingCategory models.Category
	result := database.DB.Where("slug = ?", slug).First(&existingCategory)

	if result.Error == nil {
		return c.Status(400).SendString("Category already exists")
	}

	newCategory := &models.Category{
		Name: input.Name,
		Slug: slug,
	}

	if err := database.DB.Create(newCategory).Error; err != nil {
		return c.Status(500).SendString("Failed to create category: " + err.Error())
	}

	return c.Status(201).JSON(newCategory)
}

func updateCategory(c *fiber.Ctx) error {
	categoryId := c.Params("id")

	var existingCategory models.Category
	result := database.DB.First(&existingCategory, categoryId)

	if result.Error != nil {
		return c.Status(404).SendString("Category doesn't exist")
	}

	input := struct {
		Name string `json:"name" form:"name"`
	}{}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	if len(input.Name) < 5 {
		return c.Status(400).SendString("Name must be at least 5 characters")
	}

	slug := slug.Make(input.Name)

	updatedCategory := existingCategory
	updatedCategory.Name = input.Name
	updatedCategory.Slug = slug

	if err := database.DB.Save(&updatedCategory).Error; err != nil {
		return c.Status(500).SendString("Failed to update category: " + err.Error())
	}

	return c.Status(200).JSON(updatedCategory)
}

func deleteCategory(c *fiber.Ctx) error {
	categoryId := c.Params("id")

	var existingCategory models.Category
	result := database.DB.First(&existingCategory, categoryId)

	if result.Error != nil {
		return c.Status(404).SendString("Category doesn't exist")
	}

	if err := database.DB.Delete(&existingCategory).Error; err != nil {
		return c.Status(500).SendString("Failed to delete category: " + err.Error())
	}

	return c.Status(200).JSON(struct{ success bool }{success: true})
}

func getFlashcardsForCategory(c *fiber.Ctx) error {
	categoryId := c.Params("id")

	var existingCategory models.Category
	existingResult := database.DB.First(&existingCategory, categoryId)

	if existingResult.Error != nil {
		return c.Status(404).SendString("Category doesn't exist")
	}

	var flashcards []models.Flashcard
	findResult := database.DB.Where("category_id = ?", categoryId).Find(&flashcards)

	if findResult.Error != nil {
		return c.Status(500).SendString("Cannot retrieve flashcards for category: " + findResult.Error.Error())
	}

	return c.Status(200).JSON(flashcards)
}
