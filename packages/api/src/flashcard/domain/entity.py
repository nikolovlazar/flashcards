from __future__ import annotations

from dataclasses import dataclass

from django.utils.text import slugify

from category.domain.entity import Category
from shared.domain.entity import Entity


@dataclass(eq=False)
class Flashcard(Entity):
    question: str
    answer: str
    category: Category
    slug: str

    @classmethod
    def new(cls, question: str, answer: str, category: Category) -> Flashcard:
        return cls(question=question, answer=answer, category=category, slug=slugify(question))

    def update_answer(self, answer: str) -> None:
        self.answer = answer

    def update_question(self, question: str) -> None:
        self.question = question
        self.slug = slugify(question)

    def update_category(self, category: Category) -> None:
        self.category = category
