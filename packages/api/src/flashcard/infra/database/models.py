from django.db import models
from django.utils.text import slugify

from category.infra.database.models import Category as CategoryModel
from flashcard.domain.exceptions import FlashcardQuestionTooShort


class Flashcard(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    category = models.ForeignKey(CategoryModel, on_delete=models.CASCADE)
    slug = models.SlugField(unique=True, blank=True)

    def clean(self) -> None:
        if len(self.question) < 5:
            raise FlashcardQuestionTooShort()
        self.slug = slugify(self.question)

        return super().clean()

    def save(self, *args, **kwargs):
        self.clean()
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.question
