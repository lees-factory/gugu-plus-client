import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { auth } from '$lib/stores/auth.svelte';
import { t } from '$lib/i18n/t';

export const planLabel: Record<string, string> = {
	free: 'Free',
	pro: 'Pro'
};

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
			saveSuccess: false
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
			p.current = '';
			p.next = '';
			p.confirm = '';
			setTimeout(() => (p.success = false), 3000);
		} finally {
			p.loading = false;
		}
	}

	async function handleNotifSave() {
		const n = settings.notifications;
		n.saveLoading = true;
		try {
			// TODO: 실제 API 연동
			await new Promise((r) => setTimeout(r, 500));
			n.saveSuccess = true;
			setTimeout(() => (n.saveSuccess = false), 3000);
		} finally {
			n.saveLoading = false;
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
		handleNotifSave,
		handleDeleteAccount,
		closeDeleteModal
	};
}
