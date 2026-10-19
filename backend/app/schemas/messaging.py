from pydantic import BaseModel, Field, model_validator


class ThreadCreate(BaseModel):
    subject: str = Field(min_length=2, max_length=255)
    body: str = Field(min_length=1, max_length=10000)
    recipient_tenant_id: int | None = None
    recipient_super_admin: bool = False

    @model_validator(mode="after")
    def validate_recipient(self):
        if self.recipient_super_admin == (self.recipient_tenant_id is not None):
            raise ValueError("Choose either a tenant recipient or SuperAdmin.")
        return self


class MessageCreate(BaseModel):
    body: str = Field(min_length=1, max_length=10000)
