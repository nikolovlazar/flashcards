from typing import List

import sentry_sdk

from category.domain.entity import Category
from category.infra.database.repository.rdb import CategoryRepository
from flashcard.domain.entity import Flashcard
from flashcard.infra.database.repository.rdb import FlashcardRepository


class CategoryQuery:
    category_repository: CategoryRepository
    flashcard_repository: FlashcardRepository

    def __init__(self, category_repository: CategoryRepository, flashcard_repository: FlashcardRepository):
        self.category_repository = category_repository
        self.flashcard_repository = flashcard_repository

    def get_all_categories(self) -> List[Category]:
        with sentry_sdk.start_span(name="CategoryQuery:get_all_categories"):
            return self.category_repository.find_all()

    def get_category(self, id: int) -> Category:
        with sentry_sdk.start_span(name="CategoryQuery:get_category"):
            return self.category_repository.find_by_id(id)

    def get_flashcards_by_category(self, category_id: int) -> List[Flashcard]:
        with sentry_sdk.start_span(name="CategoryQuery:get_flashcards_by_category"):
            return self.flashcard_repository.find_by_category(category_id=category_id)
