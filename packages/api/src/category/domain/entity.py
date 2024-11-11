from __future__ import annotations

from dataclasses import dataclass

from django.utils.text import slugify

from shared.domain.entity import Entity


@dataclass(eq=False)
class Category(Entity):
    name: str
    slug: str

    @classmethod
    def new(cls, name: str) -> Category:
        return cls(name=name, slug=slugify(name))

    def update_name(self, name: str) -> None:
        self.name = name
        self.slug = slugify(name)