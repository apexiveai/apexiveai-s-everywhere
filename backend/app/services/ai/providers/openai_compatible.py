
import json
from collections.abc import AsyncIterator

import httpx

from app.services.ai.providers.base import (
    AIMessage,
    AIProviderError,
    AIRequest,
)


class OpenAICompatibleProvider:
    def __init__(
        self,
        *,
        name: str,
        base_url: str,
        api_key: str = "",
        default_model: str = "",
        timeout: float = 120.0,
    ):
        if not base_url:
            raise ValueError(f"{name}: base_url is required")

        self.name = name
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.default_model = default_model
        self.timeout = timeout

    async def stream(
        self,
        request: AIRequest,
    ) -> AsyncIterator[str]:
        model = request.model or self.default_model

        if not model:
            raise AIProviderError(
                f"{self.name}: No AI model configured."
            )

        headers = {
            "Content-Type": "application/json",
            "Accept": "text/event-stream",
        }

        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        payload = {
            "model": model,
            "messages": [
                {
                    "role": message.role,
                    "content": message.content,
                }
                for message in request.messages
            ],
            "temperature": request.temperature,
            "max_tokens": request.max_tokens,
            "stream": True,
        }

        url = f"{self.base_url}/chat/completions"

        try:
            async with httpx.AsyncClient(
                timeout=httpx.Timeout(
                    self.timeout,
                    connect=15.0,
                )
            ) as client:
                async with client.stream(
                    "POST",
                    url,
                    headers=headers,
                    json=payload,
                ) as response:

                    if response.status_code >= 400:
                        error_body = (
                            await response.aread()
                        ).decode("utf-8", errors="replace")

                        raise AIProviderError(
                            f"{self.name} returned "
                            f"HTTP {response.status_code}: "
                            f"{error_body[:1000]}"
                        )

                    async for line in response.aiter_lines():
                        line = line.strip()

                        if not line or not line.startswith("data:"):
                            continue

                        data = line[5:].strip()

                        if data == "[DONE]":
                            break

                        try:
                            event = json.loads(data)
                        except json.JSONDecodeError:
                            continue

                        if event.get("error"):
                            raise AIProviderError(
                                f"{self.name}: Provider error."
                            )

                        choices = event.get("choices") or []

                        if not choices:
                            continue

                        delta = choices[0].get("delta") or {}
                        content = delta.get("content")

                        if isinstance(content, str) and content:
                            yield content

        except httpx.TimeoutException as exc:
            raise AIProviderError(
                f"{self.name}: Request timed out."
            ) from exc

        except httpx.HTTPError as exc:
            raise AIProviderError(
                f"{self.name}: Connection failed."
            ) from exc

    async def close(self) -> None:
        return None
