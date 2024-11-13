from shared.domain.exception import BaseMsgException


class CategoryNameTooShort(BaseMsgException):
    message = "Category name must be at least 5 characters long"

class CategoryNotFoundError(BaseMsgException):
    message = "Category not found"

class CategoryExistsError(BaseMsgException):
    message = "Category already exists"
