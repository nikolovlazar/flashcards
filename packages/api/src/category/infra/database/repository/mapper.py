from category.domain.entity import Category as CategoryEntity
from category.infra.database.models import Category as CategoryModel
from shared.infra.repository.mapper import ModelMapperInterface


class CategoryMapper(ModelMapperInterface):
    def to_entity(self, instance: CategoryModel) -> CategoryEntity:
      return CategoryEntity(
        id=instance.id,
        name=instance.name,
        slug=instance.slug
      )

    def to_instance(self, entity: CategoryEntity) -> CategoryModel:
        return CategoryModel(
          id=entity.id,
          name=entity.name,
          slug=entity.slug
        )