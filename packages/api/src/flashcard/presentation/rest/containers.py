from flashcard.application.use_case.command import FlashcardCommand
from flashcard.application.use_case.query import FlashcardQuery
from flashcard.infra.database.repository.rdb import FlashcardRepository

flashcard_repo: FlashcardRepository = FlashcardRepository()

flashcard_query: FlashcardQuery = FlashcardQuery(flashcard_repository=flashcard_repo)
flashcard_command: FlashcardCommand = FlashcardCommand(flashcard_repository=flashcard_repo)
