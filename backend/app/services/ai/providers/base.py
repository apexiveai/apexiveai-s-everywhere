
from dataclasses import dataclass
from typing import AsyncIterator, Protocol


@dataclass(frozen=True)
class AIMessage:
    role: str
    content: str


@dataclass(frozen=True)
class AIRequest:
    messages: list[AIMessage]
    model: str | None = None
    temperature: float = 0.7
    max_tokens: int = 4096


class AIProviderError(Exception):
    """Raised when an AI provider cannot complete a request."""


class AIProvider(Protocol):
    name: str

    async def stream(
        self,
        request: AIRequest,
    ) -> AsyncIterator[str]:
        """Yield generated text chunks."""
        ...

    async def close(self) -> None:
        """Release provider resources."""
        ...
