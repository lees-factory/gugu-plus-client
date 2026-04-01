<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '$lib/i18n/t';
	import { marketToSite } from '$lib/commerce';
	import { onMount } from 'svelte';
	import { createAlertsPage } from './alerts-page.svelte';

	const page = createAlertsPage();

	onMount(() => {
		page.load();
	});
</script>

<div class="space-y-10 p-8 sm:p-10 lg:p-14">
	<!-- Page header -->
	<div class="max-w-2xl">
		<div
			class="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200/50 bg-zinc-100/80 px-3 py-1.5"
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				class="size-3.5 text-stone-600"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
				/>
			</svg>
			<span class="text-xs font-semibold text-stone-800">{t('alerts_title')}</span>
		</div>
		<h1 class="text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
			{t('alerts_title')}
		</h1>
		<p class="mt-6 text-base leading-relaxed text-zinc-600">{t('alerts_subtitle')}</p>
	</div>

	<div class="mx-auto max-w-2xl">
		{#if page.loading}
			<div class="flex items-center justify-center py-20">
				<svg class="size-6 animate-spin text-zinc-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
				</svg>
			</div>
		{:else if page.error}
			<div
				class="rounded-3xl border border-zinc-200/60 bg-white/60 p-10 text-center backdrop-blur-sm"
			>
				<p class="text-sm text-rose-600">{page.error}</p>
			</div>
		{:else if page.alerts.length === 0}
			<div
				class="rounded-3xl border border-zinc-200/60 bg-white/60 p-14 text-center backdrop-blur-sm"
			>
				<div
					class="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl"
					style="background-color: #f7f6f3;"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						class="size-7"
						style="color: #9b9b95;"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
						/>
					</svg>
				</div>
				<p class="text-sm font-medium text-zinc-900">{t('alerts_empty_title')}</p>
				<p class="mt-1.5 text-xs text-zinc-500">{t('alerts_empty_desc')}</p>
			</div>
		{:else}
			<div
				class="overflow-hidden rounded-3xl border border-zinc-200/60 bg-white/60 backdrop-blur-sm"
			>
				<div class="px-6 py-5" style="border-bottom: 1px solid rgba(45, 45, 42, 0.06);">
					<p class="text-sm font-medium text-zinc-900">
						{t('alerts_count', { count: page.alerts.length })}
					</p>
				</div>
				<div class="divide-y" style="--tw-divide-opacity: 0.06;">
					{#each page.alerts as alert (alert.id)}
						{@const product = page.productMap.get(alert.product_id)}
						<div
							class="flex items-center justify-between gap-4 px-6 py-4 transition"
							style="opacity: {page.removingId === alert.id ? '0.5' : '1'};"
						>
							<a
								href={resolve(`/items/${alert.product_id}`)}
								class="flex min-w-0 flex-1 items-center gap-4 transition-colors hover:opacity-80"
							>
								<!-- Product image -->
								<div
									class="size-12 shrink-0 overflow-hidden rounded-xl border border-zinc-200/60 bg-zinc-100"
								>
									{#if product?.main_image_url}
										<img
											src={product.main_image_url}
											alt={product?.title ?? t('alerts_unknown_product')}
											class="size-full object-cover"
											loading="lazy"
										/>
									{:else}
										<div class="flex size-full items-center justify-center">
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="1.5"
												class="size-5"
												style="color: {alert.enabled ? '#5aad9c' : '#9b9b95'};"
												aria-hidden="true"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
												/>
											</svg>
										</div>
									{/if}
								</div>

								<!-- Product info -->
								<div class="min-w-0">
									<p class="truncate text-sm font-medium text-zinc-900">
										{product?.title ?? t('alerts_unknown_product')}
									</p>
									<div class="mt-0.5 flex items-center gap-2 text-xs text-zinc-500">
										{#if product}
											<span>{marketToSite(product.market)}</span>
											<span style="opacity: 0.3;">·</span>
										{/if}
										<span>{alert.channel}</span>
										<span style="opacity: 0.3;">·</span>
										<span>
											{new Date(alert.created_at).toLocaleDateString('ko-KR', {
												year: 'numeric',
												month: 'short',
												day: 'numeric'
											})}
										</span>
									</div>
								</div>
							</a>

							<button
								type="button"
								onclick={() => page.removeAlert(alert)}
								disabled={page.removingId === alert.id}
								aria-label={t('alerts_remove')}
								class="flex size-9 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
							>
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
										d="M6 18 18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
