from category.domain.entity import Category as CategoryEntity
from flashcard.domain.entity import Flashcard as FlashcardEntity
from flashcard.infra.database.models import Flashcard as FlashcardModel
from shared.infra.repository.mapper import ModelMapperInterface


class FlashcardMapper(ModelMapperInterface):
    def to_entity(self, model: FlashcardModel) -> FlashcardEntity:
        category = CategoryEntity(
            id=model.category.id,
            name=model.category.name,
            slug=model.category.slug,
            flashcards=[],
        )
        return FlashcardEntity(
            id=model.id,
            question=model.question,
            answer=model.answer,
            category=category,
            slug=model.slug,
        )

    def to_instance(self, entity: FlashcardEntity) -> FlashcardModel:
        return FlashcardModel(
            id=entity.id,
            question=entity.question,
            answer=entity.answer,
            category_id=entity.category.id,
            slug=entity.slug,
        )
