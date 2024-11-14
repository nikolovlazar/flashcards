from category.application.use_case.command import CategoryCommand
from category.application.use_case.query import CategoryQuery
from category.infra.database.repository.rdb import CategoryRepository
from flashcard.presentation.rest.containers import flashcard_repo

category_repo: CategoryRepository = CategoryRepository()

category_query: CategoryQuery = CategoryQuery(category_repository=category_repo, flashcard_repository=flashcard_repo)
category_command: CategoryCommand = CategoryCommand(category_repository=category_repo)
