from typing import List

from ninja import Schema

from flashcard.domain.entity import Flashcard


class FlashcardSchema(Schema):
    id: int
    question: str
    answer: str
    category_id: int
    slug: str

class FlashcardResponse(Schema):
    flashcard: FlashcardSchema

    @classmethod
    def build(cls, flashcard: Flashcard) -> dict:
        return cls(flashcard=FlashcardSchema(id=flashcard.id, question=flashcard.question, answer=flashcard.answer, category_id=flashcard.category.id, slug=flashcard.slug)).model_dump()

class ListFlashcardResponse(Schema):
    flashcards: List[FlashcardSchema]

    @classmethod
    def build(cls, flashcards: List[Flashcard]) -> dict:
        return cls(
            flashcards = [
                FlashcardSchema(id=flashcard.id, question=flashcard.question, answer=flashcard.answer, category_id=flashcard.category.id, slug=flashcard.slug)
                for flashcard in flashcards
            ]
        ).model_dump()
