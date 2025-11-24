export const SERVER_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type ApiError = {
  type: "network" | "http";
  status?: number;
  message: string;
  detail?: any;
};

export const apifetch = async (
  rel: string,
  opts?: {
    method?: string;
    headers?: Record<string, string>;
    cache?: RequestCache;
    body?: any;
  },
) => {
  const { method, headers, cache, body } = opts ?? {};

  let res: Response;

  try {
    res = await fetch(`${SERVER_BASE}${rel}`, {
      method: method ?? "GET",
      credentials: "include",
      headers,
      cache: cache ?? "no-store",
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    console.error(e);

    const err: ApiError = {
      type: "network",
      message: "failed to connect to server",
    };

    throw err;
  }

  if (!res.ok) {
    let detail: any = null;

    try {
      detail = await res.json();
    } catch {
      // ignore if detail is not json
    }

    const err: ApiError = {
      type: "http",
      status: res.status,
      message:
        detail?.message || detail?.error || `request failed (${res.status})`,
      detail,
    };
    throw err;
  }

  return res;
};
