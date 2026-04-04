import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { auth } from '$lib/stores/auth.svelte';
import { t } from '$lib/i18n/t';

export function createSettingsPage() {
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
		accountDelete: {
			confirmText: '',
			loading: false,
			modalOpen: false
		}
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

	return {
		settings,
		handlePasswordChange,
		toggleEmailNotif,
		handleDeleteAccount,
		closeDeleteModal
	};
}
