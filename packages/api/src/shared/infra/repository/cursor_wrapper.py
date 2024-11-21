from functools import wraps

from django.db.backends.utils import CursorWrapper


def delayed_execute(func):
    @wraps(func)
    def wrapper(self, sql, params=None):
        sql = f"SELECT pg_sleep(0.05); {sql}"

        return func(self, sql, params)

    return wrapper


CursorWrapper.execute = delayed_execute(CursorWrapper.execute)
