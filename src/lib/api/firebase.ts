/**
 * Firebase CDN (스크립트 형태) — 브라우저 전용.
 * app.html에 스크립트 태그 없이, 필요 시 동적으로 ESM import한다.
 */

const FIREBASE_CONFIG = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
	appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? ''
};

const CDN = 'https://www.gstatic.com/firebasejs/12.11.0';

/* eslint-disable @typescript-eslint/no-explicit-any -- Firebase CDN dynamic imports have no type defs */
let firebaseApp: any = null;
let firebaseAuth: any = null;
/* eslint-enable @typescript-eslint/no-explicit-any */

async function getAuth() {
	if (firebaseAuth) return firebaseAuth;

	const { initializeApp } = await import(/* @vite-ignore */ `${CDN}/firebase-app.js`);
	const { getAuth: _getAuth } = await import(/* @vite-ignore */ `${CDN}/firebase-auth.js`);

	firebaseApp = initializeApp(FIREBASE_CONFIG);
	firebaseAuth = _getAuth(firebaseApp);

	return firebaseAuth;
}

export async function signInWithGoogle(): Promise<{
	success: boolean;
	user?: { uid: string; email: string; displayName: string };
	error?: string;
}> {
	try {
		const auth = await getAuth();
		const { GoogleAuthProvider, signInWithPopup } = await import(
			/* @vite-ignore */ `${CDN}/firebase-auth.js`
		);

		const provider = new GoogleAuthProvider();
		const result = await signInWithPopup(auth, provider);
		const user = result.user;

		return {
			success: true,
			user: {
				uid: user.uid,
				email: user.email ?? '',
				displayName: user.displayName ?? user.email?.split('@')[0] ?? ''
			}
		};
	} catch (err: unknown) {
		const firebaseErr = err as { code?: string; message?: string };
		if (firebaseErr?.code === 'auth/popup-closed-by-user') {
			return { success: false, error: undefined };
		}
		return { success: false, error: firebaseErr?.message ?? 'Google login failed' };
	}
}
