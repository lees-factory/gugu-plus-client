/**
 * Type declarations for Paraglide JS generated modules.
 * Generated files live in ./paraglide/ and may be recreated by the compiler.
 */
declare module '$lib/paraglide/runtime' {
	export const baseLocale: string;
	export const locales: readonly string[];
	export const cookieName: string;
	export const cookieMaxAge: number;
	export const cookieDomain: string;
	export const localStorageKey: string;
	export function getLocale(): string;
	export function setLocale(locale: string, options?: { persist?: boolean }): void;
	export function localizeHref(
		href: string | URL,
		options?: { locale?: string }
	): string;
	export function deLocalizeUrl(url: string | URL): string;
	export function getTextDirection(locale?: string): 'ltr' | 'rtl';
	export function isLocale(locale: string): boolean;
}

declare module '$lib/paraglide/server' {
	import type { Request } from '@sveltejs/kit';
	export function paraglideMiddleware<T>(
		request: Request,
		resolve: (args: { request: Request; locale: string }) => T | Promise<T>,
		callbacks?: { onRedirect?: (response: Response) => void }
	): Promise<T>;
}
