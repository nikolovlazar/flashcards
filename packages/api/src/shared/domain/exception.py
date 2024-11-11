class BaseMsgException(Exception):
    message: str

    def __str__(self):
        return self.message

class ModelExistsError(BaseMsgException):
    message = "Model already exists"
