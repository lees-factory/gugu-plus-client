<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '$lib/i18n/t';

	let { icon = 'lock' }: { icon?: 'lock' | 'bell' | 'star' | 'settings' } = $props();
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
	<div
		class="mb-6 flex size-16 items-center justify-center rounded-3xl border border-zinc-200/60 bg-white shadow-sm"
	>
		{#if icon === 'lock'}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				class="size-7 text-zinc-400"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
				/>
			</svg>
		{:else if icon === 'star'}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				class="size-7 text-zinc-400"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
				/>
			</svg>
		{:else if icon === 'bell'}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				class="size-7 text-zinc-400"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
				/>
			</svg>
		{:else if icon === 'settings'}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				class="size-7 text-zinc-400"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
				/>
			</svg>
		{/if}
	</div>

	<h2 class="text-lg font-semibold text-zinc-900">{t('guest_title')}</h2>
	<p class="mt-2 max-w-xs text-sm leading-relaxed text-zinc-500">{t('guest_desc')}</p>

	<div class="mt-8 flex flex-col items-center gap-3 sm:flex-row">
		<a
			href={resolve('/auth/login')}
			class="inline-flex h-11 items-center gap-2 rounded-2xl px-7 text-sm font-semibold text-white shadow-md shadow-zinc-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
			style="background: linear-gradient(to right, #292524, #3f3f46);"
		>
			{t('guest_login')}
		</a>
		<a
			href={resolve('/auth/signup')}
			class="inline-flex h-11 items-center rounded-2xl border border-zinc-200/60 bg-white px-7 text-sm font-semibold text-zinc-700 transition-all duration-200 hover:bg-zinc-50"
		>
			{t('guest_signup')}
		</a>
	</div>
</div>
