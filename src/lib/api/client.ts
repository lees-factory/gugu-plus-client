type ApiSuccess<T> = { data: T; error: null; status: number };
type ApiError = { data: null; error: string; status: number };
export type ApiResult<T> = ApiSuccess<T> | ApiError;

/** `body`는 JSON 직렬화를 위해 별도 인자로 받는다. */
export type JsonRequestInit = Omit<RequestInit, 'body'>;

async function request<T>(url: string, options: RequestInit = {}): Promise<ApiResult<T>> {
	const res = await fetch(url, {
		credentials: 'include',
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

/** 메서드·본문을 직접 넘길 때 (기존 코드 호환) */
export async function apiCall<T = unknown>(
	url: string,
	options: RequestInit = {}
): Promise<ApiResult<T>> {
	return request<T>(url, options);
}

export async function apiGet<T>(url: string, init?: JsonRequestInit): Promise<ApiResult<T>> {
	return request<T>(url, { ...init, method: 'GET' });
}

export async function apiPost<T>(
	url: string,
	body?: unknown,
	init?: JsonRequestInit
): Promise<ApiResult<T>> {
	return request<T>(url, {
		...init,
		method: 'POST',
		body: body !== undefined ? JSON.stringify(body) : undefined
	});
}

export async function apiPatch<T>(
	url: string,
	body?: unknown,
	init?: JsonRequestInit
): Promise<ApiResult<T>> {
	return request<T>(url, {
		...init,
		method: 'PATCH',
		body: body !== undefined ? JSON.stringify(body) : undefined
	});
}

export async function apiPut<T>(
	url: string,
	body?: unknown,
	init?: JsonRequestInit
): Promise<ApiResult<T>> {
	return request<T>(url, {
		...init,
		method: 'PUT',
		body: body !== undefined ? JSON.stringify(body) : undefined
	});
}

export async function apiDelete<T>(url: string, init?: JsonRequestInit): Promise<ApiResult<T>> {
	return request<T>(url, { ...init, method: 'DELETE' });
}

/** `api.get` / `api.post` … 형태로 쓰고 싶을 때 */
export const api = {
	get: apiGet,
	post: apiPost,
	patch: apiPatch,
	put: apiPut,
	delete: apiDelete,
	call: apiCall
} as const;
