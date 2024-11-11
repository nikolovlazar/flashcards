from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI

from category.presentation.rest.api import router as category_router
from flashcard.presentation.rest.api import router as flashcard_router

api = NinjaAPI(
    title="Flashcards API",
    description="A demo API for Lazar's flashcards app",
)

api.add_router("categories", category_router)
api.add_router("flashcards", flashcard_router)

@api.get("/wipe-database")
def wipe_database(request):
    from django.db import connection
    with connection.cursor() as cursor:
        cursor.execute("TRUNCATE TABLE flashcard_flashcard, category_category CASCADE;")
    return {"message": "Database wiped successfully"}

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", api.urls),
]
