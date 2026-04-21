import type { PageServerLoad } from './$types';
import { SERVER_ENDPOINTS } from '$lib/api/endpoints.server';
import { bffFetch, BffNetworkError } from '$lib/api/bff-fetch';
import type { LoginSession } from '$lib/api/auth';
import { SETTINGS_SESSIONS_DEP } from './deps';

/**
 * 설정 페이지 로드:
 * - 비로그인 상태에서는 GuestPlaceholder를 띄우기 위해 hasSession=false 반환.
 * - 로그인 상태에서는 활성 세션 목록을 BFF를 통해 prefetch 한다.
 *   revoke 후에는 클라이언트에서 invalidate(SETTINGS_SESSIONS_DEP) 로 재동기화한다.
 */
export const load: PageServerLoad = async ({ cookies, depends }) => {
	depends(SETTINGS_SESSIONS_DEP);

	const session = cookies.get('session');
	if (!session) {
		return {
			hasSession: false,
			sessions: [] as LoginSession[],
			sessionsError: null as string | null
		};
	}

	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		return {
			hasSession: true,
			sessions: [] as LoginSession[],
			sessionsError: null as string | null
		};
	}

	let sessions: LoginSession[] = [];
	let sessionsError: string | null = null;

	try {
		const res = await bffFetch(
			SERVER_ENDPOINTS.auth.sessions,
			{ headers: { Authorization: `Bearer ${accessToken}` } },
			cookies
		);
		const body = (await res.json().catch(() => ({}))) as {
			result?: string;
			data?: LoginSession[];
			error?: { message?: string };
		};
		if (res.ok && Array.isArray(body.data)) {
			// 최근 활동 순 정렬
			sessions = [...body.data].sort((a, b) => (a.last_seen_at < b.last_seen_at ? 1 : -1));
		} else {
			sessionsError = body.error?.message ?? 'Failed to load sessions';
		}
	} catch (e) {
		sessionsError = e instanceof BffNetworkError ? e.message : 'Failed to load sessions';
	}

	return { hasSession: true, sessions, sessionsError };
};
