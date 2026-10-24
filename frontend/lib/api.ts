const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "https://commu-api.apexiveai.com/api"
).replace(/\/+$/, "");

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("apexive_token");
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

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    if (path.split("?")[0] === "/auth/login") {
      const message = data?.detail;
      throw new Error(
        typeof message === "string" ? message : "Invalid username or password.",
      );
    }
    throw new Error("LOGIN_REQUIRED");
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