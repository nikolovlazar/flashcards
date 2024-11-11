from category.application.use_case.command import CategoryCommand
from category.application.use_case.query import CategoryQuery
from category.infra.database.repository.rdb import CategoryRepository

category_repo: CategoryRepository = CategoryRepository()

category_query: CategoryQuery = CategoryQuery(category_repository=category_repo)
category_command: CategoryCommand = CategoryCommand(category_repository=category_repo)
