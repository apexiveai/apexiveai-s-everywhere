const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "https://commu-api.apexiveai.com/api"
).replace(/\/+$/, "");
const TOKEN_STORAGE_KEY = "apexive_token";
const USER_STORAGE_KEY = "apexive_user";

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getBearerTokenHeader(token = getToken()): string | null {
  return token ? `Bearer ${token}` : null;
}

export function saveAuthSession(
  accessToken: string,
  user: Record<string, unknown>,
) {
  localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

function redirectToLogin() {
  if (typeof window === "undefined") return;

  clearAuthSession();
  const next = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const query = next && !next.startsWith("/login") ? `?next=${encodeURIComponent(next)}` : "";
  window.location.replace(`/login${query}`);
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const authorization = getBearerTokenHeader(token);
  if (authorization) headers.set("Authorization", authorization);

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    const requestPath = path.split("?")[0].replace(/\/+$/, "");
    if (requestPath.endsWith("/auth/login")) {
      const message = data?.detail;
      throw new Error(
        typeof message === "string" ? message : "Invalid username or password.",
      );
    }
    redirectToLogin();
    const message = data?.detail;
    throw new Error(
      typeof message === "string"
        ? message
        : "Your session has expired. Please sign in again.",
    );
  }

  if (response.status === 403) {
    throw new Error("ADMIN_ACCESS_REQUIRED");
  }

  if (!response.ok) {
    const message =
      data?.detail || `Request failed (${response.status})`;
    throw new Error(
      typeof message === "string" ? message : JSON.stringify(message),
    );
  }

  return data as T;
}

export async function fetchAllPages<T>(path: string): Promise<T[]> {
  const pageSize = 100;
  const firstPage = await apiRequest<PaginatedResponse<T>>(
    `${path}?page=1&page_size=${pageSize}`,
  );
  const remainingPages: PaginatedResponse<T>[] = [];

  for (let page = 2; page <= firstPage.total_pages; page += 5) {
    const pageBatch = Array.from(
      { length: Math.min(5, firstPage.total_pages - page + 1) },
      (_, index) =>
        apiRequest<PaginatedResponse<T>>(
          `${path}?page=${page + index}&page_size=${pageSize}`,
        ),
    );
    remainingPages.push(...(await Promise.all(pageBatch)));
  }

  return [firstPage, ...remainingPages].flatMap((page) => page.items);
}