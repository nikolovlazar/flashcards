from ninja import Schema


class PostFlashcardRequestBody(Schema):
    question: str
    answer: str
    category_id: int


class PatchFlashcardRequestBody(Schema):
    question: str | None
    answer: str | None
    category_id: int | None
