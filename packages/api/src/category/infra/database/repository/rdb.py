from time import sleep

import sentry_sdk

from category.domain.exceptions import CategoryNotFoundError
from category.infra.database.models import Category as CategoryModel
from category.infra.database.repository.mapper import CategoryMapper
from shared.infra.repository.rdb import RDBRepository


class CategoryRepository(RDBRepository):
    model_mapper: CategoryMapper

    def __init__(self, model_mapper: CategoryMapper = CategoryMapper()):
        self.model_mapper = model_mapper

    def find_all(self):
        with sentry_sdk.start_span(name="CategoryRepository:find_all"):
            return self.model_mapper.to_entity_list(CategoryModel.objects.all())

    def find_by_id(self, id: int):
        with sentry_sdk.start_span(name="CategoryRepository:find_by_id"):
            try:
                category = self.model_mapper.to_entity(CategoryModel.objects.get(id=id))
                sleep(2)
            except CategoryModel.DoesNotExist:
                raise CategoryNotFoundError
            return category

    @staticmethod
    def delete_category(category_id: int) -> None:
        with sentry_sdk.start_span(name="CategoryRepository:delete_category"):
            try:
                category = CategoryModel.objects.get(id=category_id)
                category.delete()
            except CategoryModel.DoesNotExist:
                raise CategoryNotFoundError