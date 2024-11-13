from typing import List

from ninja import Router

from category.domain.entity import Category
from category.domain.exceptions import CategoryNotFoundError
from category.presentation.rest.containers import (
    category_command,
    category_query,
)
from category.presentation.rest.request import (
    PatchCategoryRequestBody,
    PostCategoryRequestBody,
)
from category.presentation.rest.response import (
    CategoryResponse,
    ListCategoryResponse,
)
from flashcard.domain.exceptions import FlashcardNotFoundError
from flashcard.presentation.rest.containers import flashcard_query
from flashcard.presentation.rest.response import ListFlashcardResponse
from shared.domain.exception import ModelExistsError
from shared.presentation.rest.response import (
    ErrorMessageResponse,
    ObjectResponse,
    error_response,
    response,
)

router = Router(tags=["categories"])

@router.get(
    "",
    response={
        200: ObjectResponse[ListCategoryResponse],
    }
)
def get_all_categories(request):
    categories: List[Category] = category_query.get_all_categories()
    return 200, response(ListCategoryResponse.build(categories=categories))

@router.get(
    "/{category_id}",
    response={
        200: ObjectResponse[CategoryResponse],
        404: ObjectResponse[ErrorMessageResponse],
    }
)
def get_category(request, category_id: int):
    try:
        category = category_query.get_category(id=category_id)
    except CategoryNotFoundError as e:
        return 404, error_response(str(e))

    return 200, response(CategoryResponse.build(category=category))

@router.post(
    "",
    response={
        201: ObjectResponse[CategoryResponse],
        400: ObjectResponse[ErrorMessageResponse],
    }
)
def create_category(request, body: PostCategoryRequestBody):
    try:
        category = category_command.create_category(name=body.name)
        return 201, response(CategoryResponse.build(category=category))
    except ModelExistsError:
        return 400, error_response("Category already exists")

@router.patch(
    "/{category_id}",
    response={
        200: ObjectResponse[CategoryResponse],
        404: ObjectResponse[ErrorMessageResponse],
    }
)
def update_category(request, category_id: int, body: PatchCategoryRequestBody):
    try:
        category = category_query.get_category(id=category_id)
    except CategoryNotFoundError as e:
        return 404, error_response(str(e))

    try:
        category = category_command.update_category(category=category, name=body.name)
    except CategoryNotFoundError as e:
        return 404, error_response(str(e))

    return 200, response(CategoryResponse.build(category=category))

@router.delete(
    "/{category_id}",
    response={
        204: None,
        404: ObjectResponse[ErrorMessageResponse],
    }
)
def delete_category(request, category_id: int):
    try:
        category_command.delete_category(category_id=category_id)
    except CategoryNotFoundError as e:
        return 404, error_response(str(e))

    return 204, None


@router.get(
    "/{category_id}/flashcards",
    response={
        200: ObjectResponse[ListFlashcardResponse],
        404: ObjectResponse[ErrorMessageResponse],
    }
)
def get_flashcards_by_category(request, category_id: int):
    try:
        category = category_query.get_category(id=category_id)
    except CategoryNotFoundError as e:
        return 404, error_response(str(e))

    flashcards = []
    i = 1
    while i < 50_000:
        try:
            flashcard = flashcard_query.get_flashcard(id=i)
            if flashcard.category.id == category.id:
                flashcards.append(flashcard)
        except FlashcardNotFoundError:
            pass

        i += 1

    return 200, response(ListFlashcardResponse.build(flashcards=flashcards))
