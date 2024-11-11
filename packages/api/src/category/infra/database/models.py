
from django.db import models
from django.utils.text import slugify

from category.domain.exceptions import CategoryNameTooShort


class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)

    def clean(self) -> None:
        if len(self.name) < 5:
            raise CategoryNameTooShort()
        self.slug = slugify(self.name)

        return super().clean()

    def save(self, *args, **kwargs):
        self.clean()
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.name