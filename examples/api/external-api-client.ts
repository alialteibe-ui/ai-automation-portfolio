export type ApiResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: string; status: number };

export async function postJson<TResponse>(
  url: string,
  token: string,
  payload: unknown,
): Promise<ApiResult<TResponse>> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    const parsed = text ? JSON.parse(text) : null;

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: parsed?.error?.message ?? `HTTP ${response.status}`,
      };
    }

    return { ok: true, status: response.status, data: parsed as TResponse };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : 'unknown network error',
    };
  }
}
