from typing import List

from ninja import Router

from category.domain.exceptions import CategoryNotFoundError
from category.presentation.rest.containers import category_query
from flashcard.domain.entity import Flashcard
from flashcard.domain.exceptions import (
    FlashcardExistsError,
    FlashcardNotFoundError,
    FlashcardQuestionTooShort,
)
from flashcard.presentation.rest.containers import (
    flashcard_command,
    flashcard_query,
)
from flashcard.presentation.rest.request import (
    PatchFlashcardRequestBody,
    PostFlashcardRequestBody,
)
from flashcard.presentation.rest.response import (
    FlashcardResponse,
    ListFlashcardResponse,
)
from shared.presentation.rest.response import (
    ErrorMessageResponse,
    ObjectResponse,
    error_response,
    response,
)

router = Router(tags=["flashcards"])

@router.get(
    "",
    response={
        200: ObjectResponse[ListFlashcardResponse],
    }
)
def get_all_flashcards(request):
    flashcards: List[Flashcard] = flashcard_query.get_all_flashcards()
    return 200, response(ListFlashcardResponse.build(flashcards=flashcards))

@router.get(
    "/{flashcard_id}",
    response={
        200: ObjectResponse[FlashcardResponse],
        404: ObjectResponse[ErrorMessageResponse],
    }
)
def get_flashcard(request, flashcard_id: int):
    try:
        flashcard = flashcard_query.get_flashcard(id=flashcard_id)
    except FlashcardNotFoundError as e:
        return 404, error_response(str(e))

    return 200, response(FlashcardResponse.build(flashcard=flashcard))

@router.post(
    "",
    response={
        201: ObjectResponse[FlashcardResponse],
        400: ObjectResponse[ErrorMessageResponse],
    }
)
def create_flashcard(request, body: PostFlashcardRequestBody):
    try:
        category = category_query.get_category(id=body.category_id)
    except CategoryNotFoundError:
        return 400, error_response("Category not found")

    try:
        flashcard = flashcard_command.create_flashcard(
            question=body.question,
            answer=body.answer,
            category=category
        )
        return 201, response(FlashcardResponse.build(flashcard=flashcard))
    except FlashcardQuestionTooShort:
        return 400, error_response("Question too short")
    except FlashcardExistsError:
        return 400, error_response("Flashcard already exists")

@router.patch(
    "/{flashcard_id}",
    response={
        200: ObjectResponse[FlashcardResponse],
        404: ObjectResponse[ErrorMessageResponse],
    }
)
def update_flashcard(request, flashcard_id: int, body: PatchFlashcardRequestBody):
    try:
        flashcard = flashcard_query.get_flashcard(id=flashcard_id)
    except FlashcardNotFoundError:
        return 404, error_response("Flashcard not found")

    try:
        category = category_query.get_category(id=body.category_id)
    except CategoryNotFoundError:
        return 400, error_response("Category not found")

    flashcard = flashcard_command.update_flashcard(
        flashcard=flashcard,
        question=body.question,
        answer=body.answer,
        category=category
    )

    return 200, response(FlashcardResponse.build(flashcard=flashcard))

@router.delete(
    "/{flashcard_id}",
    response={
        204: None,
        404: ObjectResponse[ErrorMessageResponse],
    }
)
def delete_flashcard(request, flashcard_id: int):
    try:
        flashcard_command.delete_flashcard(flashcard_id=flashcard_id)
    except FlashcardNotFoundError as e:
        return 404, error_response(str(e))

    return 204, None
