import sentry_sdk

from category.domain.entity import Category
from flashcard.domain.entity import Flashcard
from flashcard.infra.database.repository.rdb import FlashcardRepository


class FlashcardCommand:
    flashcard_repository: FlashcardRepository

    def __init__(self, flashcard_repository: FlashcardRepository):
        self.flashcard_repository = flashcard_repository

    def create_flashcard(self, question: str, answer: str, category: Category) -> Flashcard:
        with sentry_sdk.start_span(name="FlashcardCommand:create_flashcard"):
            flashcard: Flashcard = Flashcard.new(question=question, answer=answer, category=category)
            return self.flashcard_repository.save(entity=flashcard)

    def update_flashcard(self, flashcard: Flashcard, question: str | None, answer: str | None, category: Category | None) -> Flashcard:
        with sentry_sdk.start_span(name="FlashcardCommand:update_flashcard"):
            if question:
                flashcard.update_question(question=question)
            if answer:
                flashcard.update_answer(answer=answer)
            if category:
                flashcard.update_category(category=category)

            return self.flashcard_repository.save(entity=flashcard)

    def delete_flashcard(self, flashcard_id: int) -> None:
        with sentry_sdk.start_span(name="FlashcardCommand:delete_flashcard"):
            self.flashcard_repository.delete_flashcard(flashcard_id=flashcard_id)
