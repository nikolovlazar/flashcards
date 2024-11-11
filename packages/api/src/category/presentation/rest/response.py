from typing import List

from ninja import Schema

from category.domain.entity import Category


class CategorySchema(Schema):
    id: int
    name: str
    slug: str

class CategoryResponse(Schema):
    category: CategorySchema

    @classmethod
    def build(cls, category: Category) -> dict:
        return cls(category=CategorySchema(id=category.id, name=category.name, slug=category.slug)).model_dump()

class ListCategoryResponse(Schema):
    categories: List[CategorySchema]

    @classmethod
    def build(cls, categories: List[Category]) -> dict:
        return cls(
            categories = [
                CategorySchema(id=category.id, name=category.name, slug=category.slug)
                for category in categories
            ]
        ).model_dump()
