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

/** 컴포넌트 내부에서 호출. $state를 팩토리 내부에 두어 SSR 상태 오염을 방지한다. */
export function createPreferences() {
	const state = $state({
		targetCurrency: 'KRW' as TargetCurrency,
		targetLanguage: 'KO' as TargetLanguage
	});

	function hydrate(): void {
		if (typeof localStorage === 'undefined') return;
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return;
			const j = JSON.parse(raw) as { targetCurrency?: string; targetLanguage?: string };
			if (j.targetCurrency && isTargetCurrency(j.targetCurrency)) {
				state.targetCurrency = j.targetCurrency;
			}
			if (j.targetLanguage && isTargetLanguage(j.targetLanguage)) {
				state.targetLanguage = j.targetLanguage;
			}
		} catch {
			/* ignore */
		}
	}

	function persist(): void {
		if (typeof localStorage === 'undefined') return;
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				targetCurrency: state.targetCurrency,
				targetLanguage: state.targetLanguage
			})
		);
	}

	function setTargetCurrency(c: TargetCurrency): void {
		state.targetCurrency = c;
		persist();
	}

	function setTargetLanguage(l: TargetLanguage): void {
		state.targetLanguage = l;
		persist();
	}

	return {
		get targetCurrency() {
			return state.targetCurrency;
		},
		get targetLanguage() {
			return state.targetLanguage;
		},
		hydrate,
		setTargetCurrency,
		setTargetLanguage
	};
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
