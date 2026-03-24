import { getLocale } from '$lib/paraglide/runtime.js';
import en from './messages/en.json';
import ko from './messages/ko.json';

export type MessageKey = Exclude<keyof typeof en, '$schema'>;

export function t(key: MessageKey, params?: Record<string, string | number>): string {
	const locale = getLocale();
	const dict = (locale === 'ko' ? ko : en) as Record<string, string>;
	let raw = dict[key];
	if (typeof raw !== 'string') return String(key);
	if (params) {
		for (const [k, v] of Object.entries(params)) {
			raw = raw.replaceAll(`{${k}}`, String(v));
		}
	}
	return raw;
}
