
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class ORMResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class ConversationCreate(BaseModel):
    provider: Literal["cloud", "local"] = "cloud"


class ConversationResponse(ORMResponse):
    id: str
    title: str
    provider: str
    model: str
    created_at: datetime
    updated_at: datetime


class PublicConversationResponse(ConversationResponse):
    session_token: str


class ChatRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=20000,
    )


class MessageResponse(ORMResponse):
    id: str
    role: str
    content: str
    created_at: datetime


class ConversationDetailResponse(BaseModel):
    conversation: ConversationResponse
    messages: list[MessageResponse]


class AIModelResponse(BaseModel):
    id: str
    provider: str
    name: str
    available: bool
