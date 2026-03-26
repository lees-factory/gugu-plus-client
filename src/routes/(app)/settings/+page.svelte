<script lang="ts">
	import { getContext } from 'svelte';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import { auth } from '$lib/stores/auth.svelte';
	import { t } from '$lib/i18n/t';
	import {
		LANGUAGE_LABELS,
		preferences,
		setTargetCurrency,
		setTargetLanguage,
		TARGET_CURRENCIES,
		TARGET_LANGUAGES,
		type TargetCurrency,
		type TargetLanguage
	} from '$lib/stores/preferences.svelte';
	import {
		settings,
		planLabel,
		handlePasswordChange,
		handleNotifSave,
		handleDeleteAccount,
		closeDeleteModal
	} from './settings-page.svelte';

	const toggleSidebar = getContext<() => void>('toggleSidebar');

	$effect(() => {
		const e = auth.user?.email;
		if (e) settings.email = e;
	});
</script>

<!-- Sticky header -->
<div
	class="sticky top-0 z-10 border-b border-zinc-200/50 bg-white/70 backdrop-blur-2xl px-6 py-5 sm:px-8 sm:py-6"
>
	<div class="flex items-center gap-3">
		<div>
			<h1 class="text-2xl font-semibold sm:text-3xl text-zinc-900 tracking-tight">{t('settings_title')}</h1>
			<p class="mt-0.5 hidden text-sm sm:block text-zinc-500">{t('settings_subtitle')}</p>
		</div>
	</div>
</div>

<!-- Content -->
<div class="p-6 sm:p-8 lg:p-10">
	<div class="mx-auto max-w-2xl space-y-6">

		<!-- Account Info -->
		<section class="rounded-3xl bg-white/60 backdrop-blur-sm p-7 sm:p-8" >
			<h2 class="mb-6 text-base font-semibold text-zinc-900">{t('settings_account')}</h2>

			<div class="space-y-5">
				<!-- Email -->
				<div>
					<label class="mb-1.5 block text-sm font-medium text-zinc-900" for="email">
						{t('settings_email')}
					</label>
					<input
						id="email"
						type="email"
						value={settings.email}
						disabled
						class="w-full rounded-xl px-4 py-2.5 text-sm"
						style="
							background-color: #f5f5f4;
							border: 1px solid rgba(45, 45, 42, 0.1);
							color: #6b6b65;
							outline: none;
						"
					/>
					<p class="mt-1.5 text-xs text-zinc-500">{t('settings_email_hint')}</p>
				</div>

				<!-- Plan -->
				<div class="flex items-center justify-between rounded-2xl p-4" style="background-color: #f5f5f4;">
					<div>
						<p class="text-sm font-medium text-zinc-900">{t('settings_plan_current')}</p>
						<p class="mt-0.5 text-xs text-zinc-500">
							{#if auth.plan.type === 'free'}
								{t('settings_plan_free_desc')}
							{:else}
								{t('settings_plan_pro_desc')}
							{/if}
						</p>
					</div>
					<div class="flex items-center gap-3">
						<span
							class="rounded-lg px-2.5 py-1 text-xs font-semibold"
							style="
								background-color: {auth.plan.type === 'pro' ? '#e8f2f0' : 'rgba(45,45,42,0.06)'};
								color: {auth.plan.type === 'pro' ? '#3a8a7a' : '#6b6b65'};
							"
						>
							{planLabel[auth.plan.type] ?? auth.plan.type}
						</span>
						{#if auth.plan.type === 'free'}
							<a
								href={localizeHref('/plan')}
								class="rounded-xl px-3.5 py-2 text-xs font-medium text-white transition hover:opacity-90"
								style="background: linear-gradient(to right, #292524, #3f3f46);"
							>
								{t('settings_upgrade')}
							</a>
						{/if}
					</div>
				</div>
			</div>
		</section>

		<!-- 언어 및 통화 -->
		<section class="rounded-3xl bg-white/60 backdrop-blur-sm p-7 sm:p-8" >
			<h2 class="mb-2 text-base font-semibold text-zinc-900">{t('settings_lang_currency')}</h2>
			<p class="mb-6 text-sm text-zinc-500">
				{t('settings_lang_currency_desc')}
			</p>

			<div class="space-y-5">
				<div>
					<label class="mb-1.5 block text-sm font-medium text-zinc-900" for="pref-lang">
						{t('settings_language')}
					</label>
					<select
						id="pref-lang"
						class="w-full cursor-pointer rounded-xl px-4 py-2.5 text-sm"
						style="
							background-color: #f5f5f4;
							border: 1px solid rgba(45, 45, 42, 0.1);
							color: #1a1a17;
							outline: none;
						"
						value={preferences.targetLanguage}
						onchange={(e) => setTargetLanguage(e.currentTarget.value as TargetLanguage)}
					>
						{#each TARGET_LANGUAGES as code (code)}
							<option value={code}>{code} — {LANGUAGE_LABELS[code]}</option>
						{/each}
					</select>
				</div>
				<div>
					<label class="mb-1.5 block text-sm font-medium text-zinc-900" for="pref-currency">
						{t('settings_currency')}
					</label>
					<select
						id="pref-currency"
						class="w-full cursor-pointer rounded-xl px-4 py-2.5 text-sm"
						style="
							background-color: #f5f5f4;
							border: 1px solid rgba(45, 45, 42, 0.1);
							color: #1a1a17;
							outline: none;
						"
						value={preferences.targetCurrency}
						onchange={(e) => setTargetCurrency(e.currentTarget.value as TargetCurrency)}
					>
						{#each TARGET_CURRENCIES as code (code)}
							<option value={code}>{code}</option>
						{/each}
					</select>
				</div>
			</div>
		</section>

		<!-- Password Change -->
		<section class="rounded-3xl bg-white/60 backdrop-blur-sm p-7 sm:p-8" >
			<h2 class="mb-6 text-base font-semibold text-zinc-900">{t('settings_password')}</h2>

			<div class="space-y-4">
				<div>
					<label class="mb-1.5 block text-sm font-medium text-zinc-900" for="current-pw">
						{t('settings_password_current')}
					</label>
					<input
						id="current-pw"
						type="password"
						bind:value={settings.password.current}
						placeholder={t('settings_password_placeholder_current')}
						class="w-full rounded-xl px-4 py-2.5 text-sm transition"
						style="
							background-color: #f5f5f4;
							border: 1px solid rgba(45, 45, 42, 0.1);
							color: #1a1a17;
							outline: none;
						"
					/>
				</div>
				<div>
					<label class="mb-1.5 block text-sm font-medium text-zinc-900" for="new-pw">
						{t('settings_password_new')}
					</label>
					<input
						id="new-pw"
						type="password"
						bind:value={settings.password.next}
						placeholder={t('settings_password_placeholder_new')}
						class="w-full rounded-xl px-4 py-2.5 text-sm transition"
						style="
							background-color: #f5f5f4;
							border: 1px solid rgba(45, 45, 42, 0.1);
							color: #1a1a17;
							outline: none;
						"
					/>
				</div>
				<div>
					<label class="mb-1.5 block text-sm font-medium text-zinc-900" for="confirm-pw">
						{t('settings_password_confirm')}
					</label>
					<input
						id="confirm-pw"
						type="password"
						bind:value={settings.password.confirm}
						placeholder={t('settings_password_placeholder_confirm')}
						class="w-full rounded-xl px-4 py-2.5 text-sm transition"
						style="
							background-color: #f5f5f4;
							border: 1px solid rgba(45, 45, 42, 0.1);
							color: #1a1a17;
							outline: none;
						"
					/>
				</div>

				{#if settings.password.error}
					<p class="text-xs text-rose-600">{settings.password.error}</p>
				{/if}

				<div class="flex items-center gap-3 pt-1">
					<button
						type="button"
						onclick={handlePasswordChange}
						disabled={settings.password.loading}
						class="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
						style="background: linear-gradient(to right, #292524, #3f3f46);"
					>
						{#if settings.password.loading}
							<svg class="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
							</svg>
						{/if}
						{t('settings_password_submit')}
					</button>
					{#if settings.password.success}
						<span class="flex items-center gap-1.5 text-sm" style="color: #3a8a7a;">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
							</svg>
							{t('settings_password_success')}
						</span>
					{/if}
				</div>
			</div>
		</section>

		<!-- Notifications -->
		<section class="rounded-3xl bg-white/60 backdrop-blur-sm p-7 sm:p-8" >
			<h2 class="mb-6 text-base font-semibold text-zinc-900">{t('settings_notifications')}</h2>

			<div class="space-y-4">
				<div class="flex items-center justify-between gap-4">
					<div>
						<p class="text-sm font-medium text-zinc-900">{t('settings_notif_email')}</p>
						<p class="mt-0.5 text-xs leading-relaxed text-zinc-500">
							{t('settings_notif_email_desc')}
						</p>
					</div>
					<button
						type="button"
						role="switch"
						aria-checked={settings.notifications.email}
						title={settings.notifications.email ? t('settings_notif_on') : t('settings_notif_off')}
						onclick={() => (settings.notifications.email = !settings.notifications.email)}
						class="relative shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none"
						style="width: 44px; height: 24px; background-color: {settings.notifications.email ? '#2d2d2a' : 'rgba(45,45,42,0.2)'};"
					>
						<span
							class="absolute rounded-full bg-white transition-all duration-200"
							style="width: 18px; height: 18px; top: 3px; left: {settings.notifications.email ? '23px' : '3px'}; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"
						></span>
					</button>
				</div>

				<div class="flex items-center gap-3 pt-1">
					<button
						type="button"
						onclick={handleNotifSave}
						disabled={settings.notifications.saveLoading}
						class="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
						style="background: linear-gradient(to right, #292524, #3f3f46);"
					>
						{#if settings.notifications.saveLoading}
							<svg class="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
							</svg>
						{/if}
						{t('settings_save')}
					</button>
					{#if settings.notifications.saveSuccess}
						<span class="flex items-center gap-1.5 text-sm" style="color: #3a8a7a;">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
							</svg>
							{t('settings_saved')}
						</span>
					{/if}
				</div>
			</div>
		</section>

		<!-- 회원 탈퇴 -->
		<section class="rounded-3xl bg-white/60 backdrop-blur-sm p-7 sm:p-8" >
			<h2 class="mb-4 text-base font-semibold text-zinc-900">{t('settings_delete_account')}</h2>
			<p class="mb-5 text-sm text-zinc-500">{t('settings_delete_account_desc')}</p>
			<div class="flex justify-end">
				<button
					type="button"
					onclick={() => (settings.accountDelete.modalOpen = true)}
					class="rounded-xl px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
					style="background-color: #d4183d;"
				>
					{t('settings_delete_account_btn')}
				</button>
			</div>
		</section>

	</div>
</div>

<!-- Delete Account Modal -->
{#if settings.accountDelete.modalOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		style="background-color: rgba(0,0,0,0.4);"
		role="presentation"
		onclick={(e) => { if (e.target === e.currentTarget) closeDeleteModal(); }}
	>
		<div class="w-full max-w-md rounded-3xl bg-white/60 backdrop-blur-sm p-7 shadow-xl">
			<div class="mb-5 flex size-12 items-center justify-center rounded-xl" style="background-color: #fee8e8;">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-6 text-rose-600" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
				</svg>
			</div>
			<h3 class="mb-2 text-lg font-semibold text-zinc-900">{t('settings_delete_modal_title')}</h3>
			<p class="mb-2 text-sm text-zinc-500">{t('settings_delete_modal_intro')}</p>
			<p class="mb-6 text-sm font-semibold text-zinc-900">{t('settings_delete_confirm_word')}</p>

			<div class="mb-5">
				<label class="mb-1.5 block text-sm font-medium text-zinc-900" for="delete-confirm">
					{t('settings_delete_confirm_label')}
				</label>
				<input
					id="delete-confirm"
					type="text"
					bind:value={settings.accountDelete.confirmText}
					placeholder={t('settings_delete_confirm_word')}
					class="w-full rounded-xl px-4 py-2.5 text-sm"
					style="
						background-color: #f5f5f4;
						border: 1px solid rgba(45, 45, 42, 0.1);
						color: #1a1a17;
						outline: none;
					"
				/>
			</div>

			<div class="flex gap-3">
				<button
					type="button"
					onclick={closeDeleteModal}
					class="flex-1 rounded-xl py-2.5 text-sm font-medium transition hover:bg-[#efefed]"
					style="background-color: #f5f5f4; color: #1a1a17;"
				>
					{t('settings_delete_cancel')}
				</button>
				<button
					type="button"
					onclick={handleDeleteAccount}
					disabled={settings.accountDelete.confirmText !== t('settings_delete_confirm_word') || settings.accountDelete.loading}
					class="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40"
					style="background-color: #d4183d;"
				>
					{#if settings.accountDelete.loading}
						<svg class="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
						</svg>
					{/if}
					{t('settings_delete_submit')}
				</button>
			</div>
		</div>
	</div>
{/if}
