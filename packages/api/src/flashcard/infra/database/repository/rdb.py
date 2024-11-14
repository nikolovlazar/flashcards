from time import sleep

from flashcard.domain.exceptions import FlashcardNotFoundError
from flashcard.infra.database.models import Flashcard as FlashcardModel
from flashcard.infra.database.repository.mapper import FlashcardMapper
from shared.infra.repository.rdb import RDBRepository


class FlashcardRepository(RDBRepository):
    model_mapper: FlashcardMapper

    def __init__(self, model_mapper: FlashcardMapper = FlashcardMapper()):
        self.model_mapper = model_mapper

    def find_all(self):
        return self.model_mapper.to_entity_list(FlashcardModel.objects.all())

    def find_by_id(self, id: int):
        flashcard = None
        i = 0
        while i < 10_000:
            try:
                flashcard = self.model_mapper.to_entity(FlashcardModel.objects.get(id=id))
                if flashcard.id == id:
                    break
                flashcard = None
            except FlashcardModel.DoesNotExist:
                pass
            i += 1
            sleep(0.002)

        if flashcard is None:
            raise FlashcardNotFoundError

        return flashcard

    def find_by_category(self, category_id: int):
        return self.model_mapper.to_entity_list(FlashcardModel.objects.filter(category_id=category_id))

    @staticmethod
    def delete_flashcard(flashcard_id: int) -> None:
        try:
            flashcard = FlashcardModel.objects.get(id=flashcard_id)
            flashcard.delete()
        except FlashcardModel.DoesNotExist:
            raise FlashcardNotFoundError
