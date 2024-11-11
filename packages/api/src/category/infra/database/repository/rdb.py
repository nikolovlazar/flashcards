import sentry_sdk

from category.domain.exceptions import CategoryNotFoundError
from category.infra.database.models import Category as CategoryModel
from category.infra.database.repository.mapper import CategoryMapper
from shared.infra.repository.rdb import RDBRepository


class CategoryRepository(RDBRepository):
    model_mapper: CategoryMapper

    def __init__(self, model_mapper: CategoryMapper = CategoryMapper()):
        self.model_mapper = model_mapper

    @sentry_sdk.trace
    def find_all(self):
            return self.model_mapper.to_entity_list(CategoryModel.objects.all())

    @sentry_sdk.trace
    def find_by_id(self, id: int):
        try:
            return self.model_mapper.to_entity(CategoryModel.objects.get(id=id))
        except CategoryModel.DoesNotExist:
            raise CategoryNotFoundError

    @staticmethod
    @sentry_sdk.trace
    def delete_category(category_id: int) -> None:
        try:
            category = CategoryModel.objects.get(id=category_id)
            category.delete()
        except CategoryModel.DoesNotExist:
          raise CategoryNotFoundError