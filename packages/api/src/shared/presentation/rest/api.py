import json
import os
import time
from functools import wraps
from typing import Iterable

from django.contrib import admin
from django.urls import path
from groq import Groq
from groq.types.chat.chat_completion_message_param import (
    ChatCompletionMessageParam,
)
from ninja import NinjaAPI

from category.presentation.rest.api import router as category_router
from category.presentation.rest.containers import category_command
from flashcard.presentation.rest.api import router as flashcard_router
from flashcard.presentation.rest.containers import flashcard_command
from shared.domain.exception import ModelExistsError

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
        cursor.execute(
            "TRUNCATE TABLE flashcard_flashcard, category_category CASCADE;"
        )
    return {"message": "Database wiped successfully"}


def retry_on_error(max_attempts=3, delay_seconds=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            attempts = 0
            while attempts < max_attempts:
                try:
                    return func(*args, **kwargs)
                except (json.JSONDecodeError, ValueError) as e:
                    attempts += 1
                    if attempts == max_attempts:
                        raise e
                    time.sleep(delay_seconds)
            return func(*args, **kwargs)

        return wrapper

    return decorator


@api.get("/populate-database")
def populate_database(request):
    try:
        categories = generate_dummy_data()

        for category in categories:
            category_obj = category_command.create_category(
                name=category["name"]
            )

            for flashcard in category["flashcards"]:
                try:
                    flashcard_command.create_flashcard(
                        question=flashcard["question"],
                        answer=flashcard["answer"],
                        category=category_obj,
                    )
                except ModelExistsError as e:
                    print(
                        f"Error creating flashcard {flashcard['question']}: {str(e)}"
                    )

        print("Database populated successfully!!!!!")
    except Exception as e:
        raise ValueError(f"Unexpected error: {str(e)}")


@retry_on_error(max_attempts=5)
def generate_dummy_data():
    categories = []

    groq = Groq(api_key=os.getenv("GROQ_API_KEY"))

    # Add more explicit JSON formatting instructions
    messages: Iterable[ChatCompletionMessageParam] = [
        {
            "role": "system",
            "content": """You are a JSON generator. Only output valid, complete JSON arrays without any additional text or formatting.""",
        },
        {
            "role": "user",
            "content": "Generate flashcards for a superstore that has different departments and weird products that don't exist and don't go in those departments. Something whimsical. There are 'categories' which are the different superstores. The flashcard's question is a product that doesn't exist like 'Wooden towel' of 'Smelling stones', and the answer is a department that can't sell that product like 'Dairy' or 'Bakery' - you can't expect to find a wooden towel in the dairy department. Generate 10 categories (superstores) each with a random number of flashcards between 15 and 30. Generate them in JSON format, and don't include anything other than JSON in your response. The response should be a valid and complete JSON array of objects that contain a name property which is the name of the superstore, and a flashcards array which contains the flashcards for that superstore. All values should be unique and not repeated.",
        },
    ]

    try:
        response = groq.chat.completions.create(
            model="llama3-8b-8192",
            messages=messages,
        )

        json_string = response.choices[0].message.content

        if not json_string:
            raise ValueError("No response from Groq")

        # Clean the string
        json_string = json_string.strip()
        json_string = json_string.replace("'", '"')
        json_string = json_string.replace("\n", "")
        json_string = json_string.replace("\t", "")
        json_string = json_string.replace("\\n", "")
        json_string = json_string.replace("\\", "")

        # Validate JSON structure
        if not (json_string.startswith("[") and json_string.endswith("]")):
            raise ValueError("Invalid JSON array structure")

        try:
            json_data = json.loads(json_string)
        except json.JSONDecodeError as e:
            raise ValueError(f"JSON parsing failed: {str(e)}")

        # Validate data structure
        if not isinstance(json_data, list):
            raise ValueError("Root element must be an array")

        for category in json_data:
            if not isinstance(category, dict):
                raise ValueError("Each category must be an object")
            if "name" not in category or "flashcards" not in category:
                raise ValueError("Category missing required fields")
            if not isinstance(category["flashcards"], list):
                raise ValueError("Flashcards must be an array")

            for flashcard in category["flashcards"]:
                if not isinstance(flashcard, dict):
                    raise ValueError("Each flashcard must be an object")
                if "question" not in flashcard or "answer" not in flashcard:
                    raise ValueError("Flashcard missing required fields")

            categories.append(category)

        return categories

    except Exception as e:
        raise ValueError(f"Unexpected error: {str(e)}")


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", api.urls),
]
