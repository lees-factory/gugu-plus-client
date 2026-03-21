/** API `target_currency` 허용 값 */
export const TARGET_CURRENCIES = [
	'USD',
	'GBP',
	'CAD',
	'EUR',
	'UAH',
	'MXN',
	'TRY',
	'BRL',
	'AUD',
	'INR',
	'JPY',
	'IDR',
	'SEK',
	'KRW',
	'ILS',
	'THB',
	'CLP',
	'VND'
] as const;

/** API `target_language` 허용 값 */
export const TARGET_LANGUAGES = [
	'EN',
	'PT',
	'ES',
	'FR',
	'ID',
	'IT',
	'TH',
	'JA',
	'AR',
	'VI',
	'TR',
	'DE',
	'HE',
	'KO',
	'NL',
	'PL',
	'MX',
	'CL',
	'IN'
] as const;

export type TargetCurrency = (typeof TARGET_CURRENCIES)[number];
export type TargetLanguage = (typeof TARGET_LANGUAGES)[number];

const STORAGE_KEY = 'gugu.preferences.v1';

function isTargetCurrency(s: string): s is TargetCurrency {
	return (TARGET_CURRENCIES as readonly string[]).includes(s);
}

function isTargetLanguage(s: string): s is TargetLanguage {
	return (TARGET_LANGUAGES as readonly string[]).includes(s);
}

/** 가격·API 요청에 쓰는 표시 통화 */
export const preferences = $state({
	targetCurrency: 'KRW' as TargetCurrency,
	targetLanguage: 'KO' as TargetLanguage
});

export function hydratePreferencesFromStorage() {
	if (typeof localStorage === 'undefined') return;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return;
		const j = JSON.parse(raw) as { targetCurrency?: string; targetLanguage?: string };
		if (j.targetCurrency && isTargetCurrency(j.targetCurrency)) {
			preferences.targetCurrency = j.targetCurrency;
		}
		if (j.targetLanguage && isTargetLanguage(j.targetLanguage)) {
			preferences.targetLanguage = j.targetLanguage;
		}
	} catch {
		/* ignore */
	}
}

export function persistPreferencesToStorage() {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			targetCurrency: preferences.targetCurrency,
			targetLanguage: preferences.targetLanguage
		})
	);
}

export function setTargetCurrency(c: TargetCurrency) {
	preferences.targetCurrency = c;
	persistPreferencesToStorage();
}

export function setTargetLanguage(l: TargetLanguage) {
	preferences.targetLanguage = l;
	persistPreferencesToStorage();
}

/** 설정 화면용 짧은 라벨 */
export const LANGUAGE_LABELS: Record<TargetLanguage, string> = {
	EN: 'English',
	PT: 'Português',
	ES: 'Español',
	FR: 'Français',
	ID: 'Indonesia',
	IT: 'Italiano',
	TH: 'ไทย',
	JA: '日本語',
	AR: 'العربية',
	VI: 'Tiếng Việt',
	TR: 'Türkçe',
	DE: 'Deutsch',
	HE: 'עברית',
	KO: '한국어',
	NL: 'Nederlands',
	PL: 'Polski',
	MX: 'Español (MX)',
	CL: 'Español (CL)',
	IN: 'India (EN)'
};
