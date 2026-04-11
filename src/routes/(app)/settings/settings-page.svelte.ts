import { goto, invalidate } from '$app/navigation';
import { resolve } from '$app/paths';
import { auth } from '$lib/stores/auth.svelte';
import { t } from '$lib/i18n/t';
import { authBffApi, type LoginSession } from '$lib/api/auth';
import { SETTINGS_SESSIONS_DEP } from './deps';

/** +page.server.ts 의 load 데이터에서 세션 관련 필드만 요구한다. */
export type SettingsPageLoadData = {
	sessions: LoginSession[];
	sessionsError: string | null;
};

export function createSettingsPage(getData: () => SettingsPageLoadData) {
	const settings = $state({
		email: auth.user?.email ?? '',
		password: {
			current: '',
			next: '',
			confirm: '',
			loading: false,
			error: '',
			success: false
		},
		notifications: {
			email: true,
			saveLoading: false,
			saveSuccess: false,
			saveError: ''
		},
		sessions: {
			/** revoke 요청 중인 세션 id */
			revokingId: '' as string,
			revokeError: ''
		},
		accountDelete: {
			confirmText: '',
			loading: false,
			modalOpen: false
		}
	});

	/** load 데이터에서 그대로 넘어오는 세션 배열 (반응형) */
	const sessionItems = $derived(getData().sessions ?? []);
	const sessionsLoadError = $derived(getData().sessionsError);

	/**
	 * 현재 브라우저 세션 추정: navigator.userAgent와 일치하는 세션 중 가장 최근 last_seen.
	 * 완벽한 판별은 아니지만 "내 세션 실수로 끊기"를 막는 최소 안전장치로 사용.
	 */
	const currentSessionId = $derived.by(() => {
		if (typeof navigator === 'undefined') return '';
		const ua = navigator.userAgent;
		const match = sessionItems.find((s) => s.user_agent === ua);
		return match?.id ?? '';
	});

	async function handlePasswordChange() {
		const p = settings.password;
		p.error = '';
		if (!p.current || !p.next || !p.confirm) {
			p.error = t('settings_password_err_fill');
			return;
		}
		if (p.next !== p.confirm) {
			p.error = t('settings_password_err_match');
			return;
		}
		if (p.next.length < 8) {
			p.error = t('settings_password_err_length');
			return;
		}
		p.loading = true;
		try {
			// TODO: 실제 API 연동
			await new Promise((r) => setTimeout(r, 800));
			p.success = true;
			auth.logout();
			window.location.href = '/auth/logout';
		} catch {
			p.error = t('settings_password_err_generic');
			p.loading = false;
		}
	}

	async function toggleEmailNotif() {
		const n = settings.notifications;
		const prev = n.email;
		n.email = !prev;
		try {
			// TODO: 실제 API 연동
			await new Promise((r) => setTimeout(r, 500));
		} catch {
			n.email = prev;
			n.saveError = t('settings_notif_err_generic');
		}
	}

	async function handleDeleteAccount() {
		const d = settings.accountDelete;
		if (d.confirmText !== t('settings_delete_confirm_word')) return;
		d.loading = true;
		try {
			// TODO: 실제 API 연동
			await new Promise((r) => setTimeout(r, 1000));
			auth.logout();
			goto(resolve('/auth/login'));
		} finally {
			d.loading = false;
		}
	}

	function closeDeleteModal() {
		settings.accountDelete.modalOpen = false;
		settings.accountDelete.confirmText = '';
	}

	async function refreshSessions() {
		await invalidate(SETTINGS_SESSIONS_DEP);
	}

	async function revokeSession(sessionId: string) {
		const s = settings.sessions;
		if (s.revokingId) return;
		if (sessionId === currentSessionId) return; // 현재 세션은 로그아웃 버튼으로 유도
		if (typeof window !== 'undefined' && !window.confirm(t('settings_sessions_revoke_confirm'))) {
			return;
		}

		s.revokingId = sessionId;
		s.revokeError = '';

		const res = await authBffApi.revokeSession(sessionId);
		s.revokingId = '';

		if (res.error) {
			s.revokeError = res.error;
			return;
		}

		// 서버와 재동기화 (load 재실행)
		await refreshSessions();
	}

	return {
		settings,
		get sessionItems() {
			return sessionItems;
		},
		get sessionsLoadError() {
			return sessionsLoadError;
		},
		get currentSessionId() {
			return currentSessionId;
		},
		handlePasswordChange,
		toggleEmailNotif,
		handleDeleteAccount,
		closeDeleteModal,
		refreshSessions,
		revokeSession
	};
}
