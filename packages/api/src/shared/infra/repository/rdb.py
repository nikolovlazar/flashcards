from django.db import IntegrityError

from shared.domain.entity import EntityType
from shared.domain.exception import ModelExistsError
from shared.infra.repository.mapper import DjangoModelType, ModelMapperInterface


class RDBRepository:
    model_mapper: ModelMapperInterface

    def save(self, entity: EntityType) -> EntityType:
        instance: DjangoModelType = self.model_mapper.to_instance(entity=entity)
        try:
            instance.save()
        except IntegrityError as e:
            raise ModelExistsError(e)

        return self.model_mapper.to_entity(instance=instance)