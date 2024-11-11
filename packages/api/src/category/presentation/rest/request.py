from ninja import Schema


class PostCategoryRequestBody(Schema):
    name: str


class PatchCategoryRequestBody(Schema):
    name: str | None
