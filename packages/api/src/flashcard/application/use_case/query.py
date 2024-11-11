from typing import List

from flashcard.domain.entity import Flashcard
from flashcard.infra.database.repository.rdb import FlashcardRepository


class FlashcardQuery:
    flashcard_repository: FlashcardRepository

    def __init__(self, flashcard_repository: FlashcardRepository):
        self.flashcard_repository = flashcard_repository

    def get_all_flashcards(self) -> List[Flashcard]:
        return self.flashcard_repository.find_all()

    def get_flashcard(self, id: int) -> Flashcard:
        return self.flashcard_repository.find_by_id(id)

    def get_flashcards_by_category(self, category_id: int) -> List[Flashcard]:
        return self.flashcard_repository.find_by_category(category_id=category_id)
