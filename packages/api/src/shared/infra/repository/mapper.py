from typing import List, TypeVar

from django.db.models import Model, QuerySet

from shared.domain.entity import EntityType

DjangoModelType = TypeVar("DjangoModelType", bound=Model)


class ModelMapperInterface:
    def to_entity(self, model: DjangoModelType) -> EntityType:
        raise NotImplementedError

    def to_instance(self, entity: EntityType) -> DjangoModelType:
        raise NotImplementedError

    def to_entity_list(
        self, instances: QuerySet[DjangoModelType]
    ) -> List[EntityType]:
        return [self.to_entity(instance) for instance in instances]

    def to_instance_list(
        self, entities: List[EntityType]
    ) -> List[DjangoModelType]:
        return [self.to_instance(entity) for entity in entities]
