import { goto } from '$app/navigation';
import { auth } from '$lib/stores/auth.svelte';

export const planLabel: Record<string, string> = {
	free: 'Free',
	pro: 'Pro'
};

export const settings = $state({
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

export async function handlePasswordChange() {
	const p = settings.password;
	p.error = '';
	if (!p.current || !p.next || !p.confirm) {
		p.error = '모든 항목을 입력해 주세요.';
		return;
	}
	if (p.next !== p.confirm) {
		p.error = '새 비밀번호가 일치하지 않습니다.';
		return;
	}
	if (p.next.length < 8) {
		p.error = '비밀번호는 8자 이상이어야 합니다.';
		return;
	}
	p.loading = true;
	// TODO: 실제 API 연동
	await new Promise((r) => setTimeout(r, 800));
	p.loading = false;
	p.success = true;
	p.current = '';
	p.next = '';
	p.confirm = '';
	setTimeout(() => (p.success = false), 3000);
}

export async function handleNotifSave() {
	const n = settings.notifications;
	n.saveLoading = true;
	// TODO: 실제 API 연동
	await new Promise((r) => setTimeout(r, 500));
	n.saveLoading = false;
	n.saveSuccess = true;
	setTimeout(() => (n.saveSuccess = false), 3000);
}

export async function handleDeleteAccount() {
	const d = settings.accountDelete;
	if (d.confirmText !== '탈퇴') return;
	d.loading = true;
	// TODO: 실제 API 연동
	await new Promise((r) => setTimeout(r, 1000));
	auth.logout();
	goto('/auth/login');
}

export function closeDeleteModal() {
	settings.accountDelete.modalOpen = false;
	settings.accountDelete.confirmText = '';
}
