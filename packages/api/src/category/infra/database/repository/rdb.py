from typing import List

import sentry_sdk

from category.domain.entity import Category
from category.domain.exceptions import CategoryNotFoundError
from category.infra.database.models import Category as CategoryModel
from category.infra.database.repository.mapper import CategoryMapper
from flashcard.infra.database.models import Flashcard as FlashcardModel
from shared.infra.repository.rdb import RDBRepository


class CategoryRepository(RDBRepository):
    model_mapper: CategoryMapper

    def __init__(self, model_mapper: CategoryMapper = CategoryMapper()):
        self.model_mapper = model_mapper

    def find_all(self):
        with sentry_sdk.start_span(name="CategoryRepository:find_all"):
            categories: List[Category]
            categories = self.model_mapper.to_entity_list(
                CategoryModel.objects.all()
            )

            for category in categories:
                flashcards = FlashcardModel.objects.filter(
                    category_id=category.id
                )
                category.flashcards = [
                    {
                        "id": flashcard.id,
                        "question": flashcard.question,
                        "answer": flashcard.answer,
                        "slug": flashcard.slug,
                    }
                    for flashcard in flashcards
                ]

            return categories

    def find_by_id(self, id: int):
        with sentry_sdk.start_span(name="CategoryRepository:find_by_id"):
            return self.model_mapper.to_entity(CategoryModel.objects.get(id=id))

    @staticmethod
    def delete_category(category_id: int) -> None:
        with sentry_sdk.start_span(name="CategoryRepository:delete_category"):
            try:
                category = CategoryModel.objects.get(id=category_id)
                category.delete()
            except CategoryModel.DoesNotExist:
                raise CategoryNotFoundError
