from shared.domain.exception import BaseMsgException


class FlashcardNotFoundError(BaseMsgException):
    message = "Flashcard not found"

class FlashcardExistsError(BaseMsgException):
    message = "Flashcard already exists"


class FlashcardQuestionTooShort(BaseMsgException):
    message = "Flashcard question must be at least 5 characters long"
