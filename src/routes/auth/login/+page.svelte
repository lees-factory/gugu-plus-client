<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { t } from '$lib/i18n/t';
	import { handleGoogleLogin } from '$lib/api/google-oauth';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let showPassword = $state(false);
	let loading = $state(false);
	let oauthError = $state('');
	let oauthLoading = $state(false);

	const verified = $derived(page.url.searchParams.get('verified') === '1');
	const verifiedEmail = $derived(page.url.searchParams.get('email') ?? '');

	async function onGoogleClick() {
		oauthError = '';
		oauthLoading = true;
		await handleGoogleLogin((msg) => (oauthError = msg));
		oauthLoading = false;
	}
</script>

<div class="rounded-2xl bg-white p-7 shadow-sm" style="border: 1px solid rgba(45, 45, 42, 0.08);">
	<div class="mb-6">
		<h1 class="text-xl font-semibold" style="color: #1a1a17; letter-spacing: -0.01em;">
			{t('login_title')}
		</h1>
		<p class="mt-1 text-sm" style="color: #6b6b65;">{t('login_subtitle')}</p>
	</div>

	{#if verified}
		<div
			class="mb-4 rounded-xl px-4 py-3 text-sm"
			style="background-color: #e8f2f0; color: #2d7a6b;"
		>
			{t('login_email_verified')}
		</div>
	{/if}

	{#if form?.error || oauthError}
		<div
			class="mb-4 rounded-xl px-4 py-3 text-sm"
			style="background-color: #fee8e8; color: #d4183d;"
		>
			{form?.error ?? oauthError}
		</div>
	{/if}

	<!-- Google 로그인 (최우선) -->
	<button
		type="button"
		onclick={onGoogleClick}
		disabled={oauthLoading}
		class="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl px-4 text-sm font-medium transition-all hover:shadow-md focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
		style="border: 1px solid rgba(45, 45, 42, 0.12); background-color: #ffffff; color: #1a1a17;"
	>
		{#if oauthLoading}
			<svg class="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
				></path>
			</svg>
		{:else}
			<svg viewBox="0 0 24 24" class="size-5" aria-hidden="true">
				<path
					d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
					fill="#4285F4"
				/>
				<path
					d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					fill="#34A853"
				/>
				<path
					d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
					fill="#FBBC05"
				/>
				<path
					d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
					fill="#EA4335"
				/>
			</svg>
		{/if}
		{t('auth_google')}
	</button>

	<div class="my-6 flex items-center gap-3">
		<div class="h-px flex-1" style="background-color: rgba(45, 45, 42, 0.08);"></div>
		<span class="text-xs" style="color: #6b6b65;">{t('auth_or')}</span>
		<div class="h-px flex-1" style="background-color: rgba(45, 45, 42, 0.08);"></div>
	</div>

	<!-- 이메일 폼 -->
	<form
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				await update();
			};
		}}
		class="flex flex-col gap-4"
	>
		<div class="flex flex-col gap-2">
			<label for="email" class="text-sm font-medium" style="color: #1a1a17;"
				>{t('auth_email_label')}</label
			>
			<input
				id="email"
				name="email"
				type="email"
				value={form?.email ?? verifiedEmail}
				placeholder={t('auth_email_placeholder')}
				autocomplete="email"
				required
				class="h-11 w-full rounded-xl px-4 text-sm transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50"
				style="border: 1px solid rgba(45, 45, 42, 0.1); background-color: #f7f6f3; color: #1a1a17;"
			/>
		</div>

		<div class="flex flex-col gap-2">
			<div class="flex items-center justify-between">
				<label for="password" class="text-sm font-medium" style="color: #1a1a17;"
					>{t('auth_password_label')}</label
				>
				<a
					href={resolve('/auth/forgot')}
					class="text-xs transition hover:opacity-80"
					style="color: #6b6b65;"
				>
					{t('login_forgot')}
				</a>
			</div>
			<div class="relative">
				<input
					id="password"
					name="password"
					type={showPassword ? 'text' : 'password'}
					placeholder={t('login_password_placeholder')}
					autocomplete="current-password"
					required
					class="h-11 w-full rounded-xl px-4 pr-11 text-sm transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50"
					style="border: 1px solid rgba(45, 45, 42, 0.1); background-color: #f7f6f3; color: #1a1a17;"
				/>
				<button
					type="button"
					onclick={() => (showPassword = !showPassword)}
					aria-label={showPassword ? t('aria_hide_password') : t('aria_show_password')}
					class="absolute top-1/2 right-3 -translate-y-1/2 transition hover:opacity-80"
					style="color: #6b6b65;"
				>
					{#if showPassword}
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							class="size-4"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
							/>
						</svg>
					{:else}
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							class="size-4"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
							/>
						</svg>
					{/if}
				</button>
			</div>
		</div>

		<button
			type="submit"
			disabled={loading}
			class="h-12 w-full rounded-xl px-4 text-sm font-medium transition-all hover:shadow-md focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			style="background-color: #2d2d2a; color: #ffffff;"
		>
			{loading ? t('login_loading') : t('login_submit')}
		</button>
	</form>

	<p class="mt-6 text-center text-sm" style="color: #6b6b65;">
		{t('login_no_account')}
		<a
			href={resolve('/auth/signup')}
			class="font-medium underline-offset-2 hover:underline"
			style="color: #1a1a17;"
		>
			{t('login_signup_link')}
		</a>
	</p>
</div>
