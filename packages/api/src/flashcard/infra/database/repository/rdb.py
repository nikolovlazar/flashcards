import sentry_sdk

from flashcard.domain.exceptions import FlashcardNotFoundError
from flashcard.infra.database.models import Flashcard as FlashcardModel
from flashcard.infra.database.repository.mapper import FlashcardMapper
from shared.infra.repository.rdb import RDBRepository


class FlashcardRepository(RDBRepository):
    model_mapper: FlashcardMapper

    def __init__(self, model_mapper: FlashcardMapper = FlashcardMapper()):
        self.model_mapper = model_mapper

    @sentry_sdk.trace
    def find_all(self):
        return self.model_mapper.to_entity_list(FlashcardModel.objects.all())

    @sentry_sdk.trace
    def find_by_id(self, id: int):
        try:
            return self.model_mapper.to_entity(FlashcardModel.objects.get(id=id))
        except FlashcardModel.DoesNotExist:
            raise FlashcardNotFoundError

    @sentry_sdk.trace
    def find_by_category(self, category_id: int):
        return self.model_mapper.to_entity_list(FlashcardModel.objects.filter(category_id=category_id))

    @staticmethod
    @sentry_sdk.trace
    def delete_flashcard(flashcard_id: int) -> None:
        try:
            flashcard = FlashcardModel.objects.get(id=flashcard_id)
            flashcard.delete()
        except FlashcardModel.DoesNotExist:
            raise FlashcardNotFoundError
