
export type AIProvider = "cloud" | "local";

export type AIModel = {
  provider: AIProvider;
  model: string;
  available: boolean;
  label: string;
};

export type AIConversation = {
  id: string;
  title: string;
  provider?: AIProvider;
  model?: string;
  created_at?: string;
  updated_at?: string;
};

export type AIMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type CreateConversationResult = {
  conversation: AIConversation;
  sessionToken?: string;
};

type StreamCallbacks = {
  onToken: (token: string) => void;
  onDone?: (data?: unknown) => void;
  onError?: (message: string) => void;
};

const configuredBase = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const API_BASE = configuredBase.endsWith("/api")
  ? configuredBase.slice(0, -4)
  : configuredBase;

const API_PREFIX = "/api/ai";

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  for (const key of [
    "access_token",
    "accessToken",
    "token",
    "apexiveai_access_token",
  ]) {
    const value = window.localStorage.getItem(key);
    if (value) return value;
  }

  return null;
}

function getSessionToken(conversationId: string): string | null {
  if (typeof window === "undefined") return null;

  return window.sessionStorage.getItem(
    `apexiveai_ai_session_${conversationId}`
  );
}

function saveSessionToken(
  conversationId: string,
  token?: string
): void {
  if (!token || typeof window === "undefined") return;

  window.sessionStorage.setItem(
    `apexiveai_ai_session_${conversationId}`,
    token
  );
}

function getHeaders(
  extra?: HeadersInit,
  conversationId?: string
): Headers {
  const headers = new Headers(extra);
  const token = getAccessToken();

  headers.set("Accept", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (conversationId) {
    const sessionToken = getSessionToken(conversationId);

    if (sessionToken) {
      headers.set("X-AI-Session", sessionToken);
    }
  }

  return headers;
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  conversationId?: string
): Promise<T> {
  const headers = getHeaders(options.headers, conversationId);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${API_PREFIX}${path}`, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const data = await response.json();
      message =
        data.detail ||
        data.message ||
        data.error ||
        message;
    } catch {
      // Keep fallback.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function unwrapObject(value: unknown): Record<string, unknown> {
  const object = asObject(value);

  if (object.data && typeof object.data === "object") {
    return object.data as Record<string, unknown>;
  }

  return object;
}

function normalizeConversation(value: unknown): AIConversation {
  const object = asObject(value);

  return {
    id: String(object.id || object.conversation_id || ""),
    title: String(object.title || "New conversation"),
    provider: object.provider === "local" ? "local" : "cloud",
    model: object.model ? String(object.model) : undefined,
    created_at: object.created_at
      ? String(object.created_at)
      : undefined,
    updated_at: object.updated_at
      ? String(object.updated_at)
      : undefined,
  };
}

function normalizeMessage(value: unknown): AIMessage {
  const object = asObject(value);
  const rawRole = String(object.role || "assistant").toLowerCase();

  return {
    id: String(
      object.id ||
      object.message_id ||
      `${Date.now()}-${Math.random().toString(36).slice(2)}`
    ),
    role: rawRole === "user" ? "user" : "assistant",
    content: String(object.content || object.message || ""),
    createdAt: String(
      object.created_at ||
      object.createdAt ||
      new Date().toISOString()
    ),
  };
}

export async function getAIModels(): Promise<AIModel[]> {
  const response = await apiRequest<unknown>("/models");
  const object = unwrapObject(response);

  const rawModels = Array.isArray(response)
    ? response
    : Array.isArray(object.models)
      ? object.models
      : [];

  return rawModels
    .map((item) => {
      const model = asObject(item);
      const provider: AIProvider =
        model.provider === "local" ? "local" : "cloud";

      return {
        provider,
        model: String(
          model.model || model.name || model.id || ""
        ),
        label: String(
          model.label || model.model || model.name || "AI Model"
        ),
        available: model.available !== false,
      };
    })
    .filter((model) => model.model.length > 0);
}

export async function getConversations(): Promise<AIConversation[]> {
  const response = await apiRequest<unknown>("/conversations");
  const object = unwrapObject(response);

  const items = Array.isArray(response)
    ? response
    : Array.isArray(object.items)
      ? object.items
      : Array.isArray(object.conversations)
        ? object.conversations
        : [];

  return items
    .map(normalizeConversation)
    .filter((item) => item.id.length > 0);
}

export async function getConversation(
  conversationId: string
): Promise<{
  conversation: AIConversation;
  messages: AIMessage[];
}> {
  const response = await apiRequest<unknown>(
    `/conversations/${encodeURIComponent(conversationId)}`,
    { method: "GET" },
    conversationId
  );

  const object = unwrapObject(response);

  const conversationObject =
    object.conversation &&
    typeof object.conversation === "object"
      ? object.conversation
      : object;

  const rawMessages = Array.isArray(object.messages)
    ? object.messages
    : Array.isArray(object.items)
      ? object.items
      : Array.isArray(
          asObject(conversationObject).messages
        )
        ? (asObject(conversationObject).messages as unknown[])
        : [];

  return {
    conversation: normalizeConversation(conversationObject),
    messages: rawMessages
      .map(normalizeMessage)
      .filter((message) => message.content.length > 0),
  };
}

export async function createConversation(
  provider: AIProvider
): Promise<CreateConversationResult> {
  const response = await apiRequest<unknown>(
    "/conversations",
    {
      method: "POST",
      body: JSON.stringify({ provider }),
    }
  );

  const object = unwrapObject(response);

  const conversation = normalizeConversation(
    object.conversation || object
  );

  if (!conversation.id) {
    throw new Error(
      "The server did not return a conversation ID."
    );
  }

  const sessionToken =
    typeof object.session_token === "string"
      ? object.session_token
      : undefined;

  saveSessionToken(conversation.id, sessionToken);

  return { conversation, sessionToken };
}

export async function deleteConversation(
  conversationId: string
): Promise<void> {
  await apiRequest(
    `/conversations/${encodeURIComponent(conversationId)}`,
    { method: "DELETE" },
    conversationId
  );

  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(
      `apexiveai_ai_session_${conversationId}`
    );
  }
}

export async function streamAIChat(
  conversationId: string,
  message: string,
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const headers = getHeaders(
    {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    conversationId
  );

  const response = await fetch(
    `${API_BASE}${API_PREFIX}/chat/${encodeURIComponent(conversationId)}`,
    {
      method: "POST",
      headers,
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ message }),
      signal,
    }
  );

  if (!response.ok) {
    let errorMessage = `AI request failed (${response.status})`;

    try {
      const data = await response.json();
      errorMessage =
        data.detail || data.message || errorMessage;
    } catch {
      // Keep fallback.
    }

    throw new Error(errorMessage);
  }

  if (!response.body) {
    throw new Error("Streaming is not supported by this response.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  function processEvent(rawEvent: string): void {
    const lines = rawEvent.split(/\r?\n/);
    let eventName = "message";
    const dataLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith("event:")) {
        eventName = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).trim());
      }
    }

    if (!dataLines.length) return;

    const rawData = dataLines.join("\n");

    if (rawData === "[DONE]") {
      callbacks.onDone?.();
      return;
    }

    let payload: Record<string, unknown>;

    try {
      payload = asObject(JSON.parse(rawData));
    } catch {
      payload = { content: rawData };
    }

    const type = String(payload.type || eventName);

    if (type === "token" || eventName === "token") {
      const token =
        payload.content ?? payload.token ?? payload.text;

      if (typeof token === "string" && token) {
        callbacks.onToken(token);
      }
      return;
    }

    if (type === "error" || eventName === "error") {
      callbacks.onError?.(
        String(
          payload.message ||
          payload.detail ||
          "AI response failed."
        )
      );
      return;
    }

    if (type === "done" || eventName === "done") {
      callbacks.onDone?.(payload);
      return;
    }

    if (
      eventName === "message" &&
      typeof payload.content === "string"
    ) {
      callbacks.onToken(payload.content);
    }
  }

  try {
    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let match = /\r?\n\r?\n/.exec(buffer);

      while (match) {
        const event = buffer.slice(0, match.index);
        buffer = buffer.slice(match.index + match[0].length);

        processEvent(event);
        match = /\r?\n\r?\n/.exec(buffer);
      }
    }

    buffer += decoder.decode();

    if (buffer.trim()) {
      processEvent(buffer);
    }
  } finally {
    reader.releaseLock();
  }
}
