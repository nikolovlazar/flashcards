from django.apps import AppConfig


class CategoryConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "category"

    def ready(self):
        import shared.infra.database.execute_patch
