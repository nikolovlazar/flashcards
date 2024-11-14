import sentry_sdk

from category.domain.entity import Category
from category.infra.database.repository.rdb import CategoryRepository


class CategoryCommand:
    category_repository: CategoryRepository

    def __init__(self, category_repository: CategoryRepository):
        self.category_repository = category_repository

    def create_category(self, name: str) -> Category:
        with sentry_sdk.start_span(name="CategoryCommand:create_category"):
            category: Category = Category.new(name=name)
            return self.category_repository.save(entity=category)

    def update_category(self, category: Category, name: str | None) -> Category:
        with sentry_sdk.start_span(name="CategoryCommand:update_category"):
            if name:
                category.update_name(name=name)

            return self.category_repository.save(entity=category)

    def delete_category(self, category_id: int) -> None:
        with sentry_sdk.start_span(name="CategoryCommand:delete_category"):
            self.category_repository.delete_category(category_id=category_id)
