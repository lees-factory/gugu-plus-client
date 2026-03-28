import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { authBffApi } from './auth';
import { signInWithGoogle } from './firebase';

/**
 * Google 로그인 실행:
 * 1. Firebase Auth 팝업으로 Google 계정 선택
 * 2. uid, email, displayName을 백엔드 OAuth API로 전달
 * 3. BFF가 쿠키 설정 후 메인 페이지로 이동
 */
export async function handleGoogleLogin(onError: (msg: string) => void) {
	const google = await signInWithGoogle();

	if (!google.success) {
		if (google.error) onError(google.error);
		return;
	}

	const { uid, email, displayName } = google.user!;

	const result = await authBffApi.oauthLogin({
		provider: 'google',
		subject: uid,
		email,
		display_name: displayName
	});

	if (result.error) {
		onError(result.error);
		return;
	}

	await goto(resolve('/'), { replaceState: true });
}
