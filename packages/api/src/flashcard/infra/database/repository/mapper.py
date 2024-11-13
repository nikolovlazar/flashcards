from category.domain.entity import Category as CategoryEntity
from flashcard.domain.entity import Flashcard as FlashcardEntity
from flashcard.infra.database.models import Flashcard as FlashcardModel
from shared.infra.repository.mapper import ModelMapperInterface


class FlashcardMapper(ModelMapperInterface):
    def to_entity(self, instance: FlashcardModel) -> FlashcardEntity:
        category = CategoryEntity(id=instance.category_id, name=instance.category.name, slug=instance.category.slug)
        return FlashcardEntity(
            id=instance.id,
            question=instance.question,
            answer=instance.answer,
            category=category,
            slug=instance.slug
        )

    def to_instance(self, entity: FlashcardEntity) -> FlashcardModel:
        return FlashcardModel(
            id=entity.id,
            question=entity.question,
            answer=entity.answer,
            category_id=entity.category.id,
            slug=entity.slug
        )
