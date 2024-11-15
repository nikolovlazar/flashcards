from __future__ import annotations

from dataclasses import dataclass
from typing import List

from django.utils.text import slugify

from shared.domain.entity import Entity


@dataclass(eq=False)
class Category(Entity):
    name: str
    slug: str
    flashcards: List[object] | None

    @classmethod
    def new(cls, name: str, flashcards: List[object] | None = None) -> Category:
        return cls(name=name, slug=slugify(name), flashcards=flashcards)

    def update_name(self, name: str) -> None:
        self.name = name
        self.slug = slugify(name)
