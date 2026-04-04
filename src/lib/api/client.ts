import { t } from '$lib/i18n/t';

type ApiSuccess<T> = { data: T; error: null; status: number };
type ApiError = { data: null; error: string; status: number };
export type ApiResult<T> = ApiSuccess<T> | ApiError;

/** `body`는 JSON 직렬화를 위해 별도 인자로 받는다. */
export type JsonRequestInit = Omit<RequestInit, 'body'>;

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

/** 재시도 대상: 네트워크 실패(0/503), 타임아웃(408), 과부하(429), 502/504 게이트웨이 에러만 */
function isRetryable(status: number): boolean {
	return (
		status === 0 ||
		status === 408 ||
		status === 429 ||
		status === 502 ||
		status === 503 ||
		status === 504
	);
}

/** 상태 코드별 사용자 친화적 메시지 (i18n) */
function friendlyError(status: number, serverMsg?: string): string {
	if (status === 401) return t('error_auth_required');
	if (status === 403) return t('error_forbidden');
	if (status === 404) return t('error_not_found');
	if (status === 429) return t('error_too_many_requests');
	if (status === 503) return t('error_service_unavailable');
	if (status >= 500) return t('error_server');
	return serverMsg || t('error_default');
}

function delay(ms: number): Promise<void> {
	return new Promise((r) => setTimeout(r, ms));
}

async function request<T>(url: string, options: RequestInit = {}): Promise<ApiResult<T>> {
	let lastStatus = 503;
	let lastServerMsg: string | undefined;

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		if (attempt > 0) {
			await delay(BASE_DELAY_MS * Math.pow(2, attempt - 1) * (0.5 + Math.random() * 0.5));
		}

		const res = await fetch(url, {
			credentials: 'include',
			headers: { 'Content-Type': 'application/json', ...options.headers },
			...options
		}).catch(() => null);

		if (!res) {
			lastStatus = 503;
			lastServerMsg = undefined;
			if (attempt < MAX_RETRIES) continue;
			return { data: null, error: friendlyError(503), status: 503 };
		}

		const body = await res.json().catch(() => ({}));

		if (res.ok) {
			return { data: body, error: null, status: res.status };
		}

		lastStatus = res.status;
		lastServerMsg = body.error?.message ?? body.message;

		// 재시도 가능한 에러만 retry
		if (isRetryable(res.status) && attempt < MAX_RETRIES) continue;

		return {
			data: null,
			error: friendlyError(res.status, lastServerMsg),
			status: res.status
		};
	}

	return { data: null, error: friendlyError(lastStatus, lastServerMsg), status: lastStatus };
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
