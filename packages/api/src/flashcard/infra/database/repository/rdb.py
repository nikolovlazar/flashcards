from time import sleep

import sentry_sdk

from flashcard.domain.exceptions import FlashcardNotFoundError
from flashcard.infra.database.models import Flashcard as FlashcardModel
from flashcard.infra.database.repository.mapper import FlashcardMapper
from shared.infra.repository.rdb import RDBRepository


class FlashcardRepository(RDBRepository):
    model_mapper: FlashcardMapper

    def __init__(self, model_mapper: FlashcardMapper = FlashcardMapper()):
        self.model_mapper = model_mapper

    def find_all(self):
        with sentry_sdk.start_span(name="FlashcardRepository:find_all"):
            return self.model_mapper.to_entity_list(FlashcardModel.objects.all())

    def find_by_id(self, id: int):
        with sentry_sdk.start_span(name="FlashcardRepository:find_by_id"):
            try:
                flashcard = self.model_mapper.to_entity(FlashcardModel.objects.get(id=id))
                sleep(2)
            except FlashcardModel.DoesNotExist:
                raise FlashcardNotFoundError

            return flashcard

    def find_by_category(self, category_id: int):
        with sentry_sdk.start_span(name="FlashcardRepository:find_by_category"):
            return self.model_mapper.to_entity_list(FlashcardModel.objects.filter(category_id=category_id))

    @staticmethod
    def delete_flashcard(flashcard_id: int) -> None:
        with sentry_sdk.start_span(name="FlashcardRepository:delete_flashcard"):
            try:
                flashcard = FlashcardModel.objects.get(id=flashcard_id)
                flashcard.delete()
            except FlashcardModel.DoesNotExist:
                raise FlashcardNotFoundError
