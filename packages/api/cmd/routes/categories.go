package routes

import (
	errs "api/internal/errors"
	"api/internal/services"

	"github.com/gofiber/fiber/v2"
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
	categories, error := services.GetCategories()

	if error != nil {
		return c.Status(500).SendString("Cannot retrieve categories: " + error.Error())
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

	newCategory, err := services.CreateCategory(struct{ Name string }{Name: input.Name})
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	return c.Status(201).JSON(newCategory)
}

func updateCategory(c *fiber.Ctx) error {
	categoryId := c.Params("id")

	input := struct {
		Name string `json:"name" form:"name"`
	}{}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	updatedCategory, err := services.UpdateCategory(categoryId, struct{ Name string }{Name: input.Name})
	if err != nil {
		switch e := err.(type) {
		case *errs.InputParseError:
			return c.Status(400).SendString(e.Error())
		case *errs.NotFoundError:
			return c.Status(404).SendString(e.Error())
		case *errs.OperationError:
			return c.Status(500).SendString(e.Error())
		}
	}

	return c.Status(200).JSON(updatedCategory)
}

func deleteCategory(c *fiber.Ctx) error {
	categoryId := c.Params("id")

	success, err := services.DeleteCategory(categoryId)
	if err != nil {
		switch e := err.(type) {
		case *errs.NotFoundError:
			return c.Status(404).SendString(e.Error())
		case *errs.OperationError:
			return c.Status(500).SendString(e.Error())
		}
	}

	return c.Status(200).JSON(struct{ success bool }{success})
}

func getFlashcardsForCategory(c *fiber.Ctx) error {
	categoryId := c.Params("id")

	flashcards, err := services.GetFlashcardsForCategory(categoryId)
	if err != nil {
		switch e := err.(type) {
		case *errs.NotFoundError:
			return c.Status(404).SendString(e.Error())
		case *errs.OperationError:
			return c.Status(500).SendString(e.Error())
		}
	}

	return c.Status(200).JSON(flashcards)
}
