package routes

import (
	errs "api/internal/errors"
	"api/internal/services"

	"github.com/gofiber/fiber/v2"
)

func RegisterFlashcardsRoutes(app *fiber.App) {
	api := app.Group("/flashcards")

	api.Get("/", getFlashcards)
	api.Put("/", createFlashcard)
	api.Post("/:id", updateFlashcard)
	api.Delete("/:id", deleteFlashcard)
}

func getFlashcards(c *fiber.Ctx) error {
	flashcards, err := services.GetFlashcards()
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	return c.Status(200).JSON(flashcards)
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

	newFlashcard, err := services.CreateFlashcard(struct {
		Question string
		Answer   string
		Category uint
	}{Question: input.Question, Answer: input.Answer, Category: input.Category})
	if err != nil {
		switch e := err.(type) {
		case *errs.NotFoundError:
			return c.Status(404).SendString(e.Error())
		default:
			return c.Status(500).SendString(e.Error())
		}
	}

	return c.Status(201).JSON(newFlashcard)
}

func updateFlashcard(c *fiber.Ctx) error {
	flashcardId := c.Params("id")

	input := struct {
		Question *string `json:"question,omitempty" form:"question,omitempty"`
		Answer   *string `json:"answer,omitempty" form:"answer,omitempty"`
		Category *uint   `json:"category,omitempty" form:"category,omitempty"`
	}{}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	updatedFlashcard, err := services.UpdateFlashcard(flashcardId, struct {
		Question *string
		Answer   *string
		Category *uint
	}{Question: input.Question, Answer: input.Answer, Category: input.Category})
	if err != nil {
		switch e := err.(type) {
		case *errs.NotFoundError:
			return c.Status(400).SendString(e.Error())
		default:
			return c.Status(500).SendString(e.Error())
		}
	}

	return c.Status(200).JSON(updatedFlashcard)
}

func deleteFlashcard(c *fiber.Ctx) error {
	flashcardId := c.Params("id")

	success, err := services.DeleteFlashcard(flashcardId)
	if err != nil {
		switch e := err.(type) {
		case *errs.NotFoundError:
			c.Status(404).SendString(e.Error())
		default:
			c.Status(500).SendString(e.Error())
		}
	}

	return c.Status(200).JSON(struct{ success bool }{success})
}
