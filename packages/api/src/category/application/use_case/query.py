from typing import List

from category.domain.entity import Category
from category.infra.database.repository.rdb import CategoryRepository


class CategoryQuery:
    category_repository: CategoryRepository

    def __init__(self, category_repository: CategoryRepository):
        self.category_repository = category_repository

    def get_all_categories(self) -> List[Category]:
        return self.category_repository.find_all()

    def get_category(self, id: int) -> Category:
        return self.category_repository.find_by_id(id)
