type ApiSuccess<T> = { data: T; error: null; status: number };
type ApiError = { data: null; error: string; status: number };
export type ApiResult<T> = ApiSuccess<T> | ApiError;

export async function apiCall<T = unknown>(
	url: string,
	options: RequestInit = {}
): Promise<ApiResult<T>> {
	const res = await fetch(url, {
		headers: { 'Content-Type': 'application/json', ...options.headers },
		...options
	}).catch(() => null);

	if (!res) {
		return { data: null, error: 'Cannot reach backend. Is the server running?', status: 503 };
	}

	const body = await res.json().catch(() => ({}));

	if (!res.ok) {
		return {
			data: null,
			error: body.error?.message ?? body.message ?? 'An unexpected error occurred.',
			status: res.status
		};
	}

	return { data: body, error: null, status: res.status };
}
