<script lang="ts">
	import { t } from '$lib/i18n/t';
	import {
		MONTHLY_PRICE,
		YEARLY_PRICE,
		createPlanPage,
		yearlyPerMonth,
		yearlySavings
	} from './plan-page.svelte';

	const page = createPlanPage();
</script>

<div class="space-y-10 p-8 sm:p-10 lg:p-14">
	<!-- ── Page hero ──────────────────────────────────────────────── -->
	<div class="max-w-2xl">
		<div
			class="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200/50 bg-zinc-100/80 px-3 py-1.5"
		>
			<svg
				viewBox="0 0 24 24"
				fill="currentColor"
				class="size-3.5 text-stone-600"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5Z"
					clip-rule="evenodd"
				/>
			</svg>
			<span class="text-xs font-semibold text-stone-800">{t('plan_badge')}</span>
		</div>
		<h1 class="text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
			{t('plan_title')}<br />
			<span class="text-zinc-600">{t('plan_title_accent')}</span>
		</h1>
		<p class="mt-6 text-base leading-relaxed text-zinc-600">
			{t('plan_desc')}
		</p>
	</div>

	<!-- ── Current plan banner ────────────────────────────────────── -->
	{#if page.currentPlan === 'free'}
		<div
			class="flex items-center gap-4 rounded-3xl border border-zinc-200/60 bg-white/60 p-5 shadow-sm backdrop-blur-sm"
		>
			<div
				class="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200/60 bg-zinc-100/80"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="size-5 text-zinc-500"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
					/>
				</svg>
			</div>
			<div>
				<p class="text-sm font-semibold text-zinc-900">{t('plan_current_free')}</p>
				<p class="mt-0.5 text-xs text-zinc-500">
					{t('plan_upgrade_hint')}
				</p>
			</div>
		</div>
	{:else}
		<div
			class="flex items-center gap-4 rounded-3xl border border-zinc-200/60 bg-white/60 p-5 shadow-sm backdrop-blur-sm"
		>
			<div
				class="flex size-10 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
				style="background: linear-gradient(135deg, #292524, #3f3f46);"
			>
				<svg viewBox="0 0 24 24" fill="currentColor" class="size-5" aria-hidden="true">
					<path
						fill-rule="evenodd"
						d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5Z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
			<div>
				<p class="text-sm font-semibold text-zinc-900">{t('plan_current_pro')}</p>
				<p class="mt-0.5 text-xs text-zinc-500">{t('plan_pro_all_features')}</p>
			</div>
		</div>
	{/if}

	<!-- ── Billing toggle ─────────────────────────────────────────── -->
	<div class="flex justify-center">
		<div class="flex gap-1.5 rounded-2xl border border-zinc-200/60 bg-zinc-50/80 p-1.5">
			<button
				type="button"
				onclick={() => page.setBillingCycle('monthly')}
				class="rounded-xl px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200
					{page.model.billingCycle === 'monthly'
					? 'bg-white text-stone-800 shadow-sm ring-1 ring-zinc-200/80'
					: 'text-zinc-600 hover:bg-zinc-100/60 hover:text-zinc-900'}"
			>
				{t('plan_monthly')}
			</button>
			<button
				type="button"
				onclick={() => page.setBillingCycle('yearly')}
				class="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200
					{page.model.billingCycle === 'yearly'
					? 'bg-white text-stone-800 shadow-sm ring-1 ring-zinc-200/80'
					: 'text-zinc-600 hover:bg-zinc-100/60 hover:text-zinc-900'}"
			>
				{t('plan_yearly')}
				<span
					class="rounded-full border border-emerald-100/50 bg-linear-to-r from-emerald-50 to-teal-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700"
				>
					{t('plan_yearly_discount')}
				</span>
			</button>
		</div>
	</div>

	<!-- ── Plan cards ─────────────────────────────────────────────── -->
	<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
		<!-- Free -->
		<div
			class="flex flex-col rounded-3xl border border-zinc-200/60 bg-white/60 p-7 shadow-sm backdrop-blur-sm"
		>
			<div class="mb-6">
				<div class="mb-4 flex items-center justify-between">
					<span
						class="rounded-lg border border-zinc-200/60 bg-zinc-100/80 px-3 py-1 text-xs font-semibold tracking-wider text-zinc-600 uppercase"
					>
						FREE
					</span>
					{#if page.currentPlan === 'free'}
						<span
							class="rounded-lg border border-zinc-200/60 bg-zinc-50/80 px-3 py-1 text-xs font-medium text-zinc-500"
						>
							{t('plan_current')}
						</span>
					{/if}
				</div>
				<div class="mb-1 flex items-baseline gap-1">
					<span class="text-4xl font-semibold tracking-tight text-zinc-900">₩0</span>
				</div>
				<p class="text-sm text-zinc-500">{t('plan_free_forever')}</p>
			</div>

			<ul class="mb-7 flex flex-col gap-3.5">
				{#each page.freeFeatures as feature (feature.text)}
					<li class="flex items-start gap-3 text-sm">
						{#if feature.included}
							<div
								class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-zinc-100 to-stone-100"
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									class="size-3 text-zinc-700"
									aria-hidden="true"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
								</svg>
							</div>
							<span class="text-zinc-700">{feature.text}</span>
						{:else}
							<div
								class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-100/60"
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									class="size-3 text-zinc-400"
									aria-hidden="true"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
								</svg>
							</div>
							<span class="text-zinc-400">{feature.text}</span>
						{/if}
					</li>
				{/each}
			</ul>

			<div class="mt-auto">
				{#if page.currentPlan === 'free'}
					<button
						type="button"
						disabled
						class="w-full cursor-default rounded-xl border border-zinc-200/60 bg-zinc-50/80 py-3 text-sm font-medium text-zinc-400"
					>
						{t('plan_current')}
					</button>
				{:else}
					<button
						type="button"
						class="w-full rounded-xl border border-zinc-200/60 bg-white py-3 text-sm font-medium text-zinc-600 transition-all duration-200 hover:bg-zinc-50 hover:text-zinc-900"
					>
						{t('plan_downgrade')}
					</button>
				{/if}
			</div>
		</div>

		<!-- Pro -->
		<div
			class="relative flex flex-col rounded-3xl p-7 shadow-lg shadow-zinc-900/10"
			style="background: linear-gradient(160deg, #292524 0%, #3f3f46 100%); border: 1px solid rgba(255,255,255,0.06);"
		>
			<!-- Popular badge -->
			<div class="absolute -top-3.5 left-1/2 -translate-x-1/2">
				<span
					class="rounded-full border border-zinc-700/40 bg-zinc-800 px-4 py-1 text-[11px] font-semibold tracking-wider whitespace-nowrap text-white/90 uppercase shadow-sm"
				>
					{t('plan_popular')}
				</span>
			</div>

			<div class="mb-6">
				<div class="mb-4 flex items-center justify-between">
					<span
						class="rounded-lg px-3 py-1 text-xs font-semibold tracking-wider text-white/90 uppercase"
						style="background: rgba(255,255,255,0.12);"
					>
						PRO
					</span>
					{#if page.currentPlan === 'pro'}
						<span
							class="rounded-lg px-3 py-1 text-xs font-medium"
							style="background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.6);"
						>
							{t('plan_current')}
						</span>
					{/if}
				</div>

				{#if page.model.billingCycle === 'monthly'}
					<div class="mb-1 flex items-baseline gap-1">
						<span class="text-4xl font-semibold tracking-tight text-white"
							>₩{MONTHLY_PRICE.toLocaleString()}</span
						>
						<span class="text-sm" style="color: rgba(255,255,255,0.45);">{t('plan_per_month')}</span
						>
					</div>
					<p class="text-sm" style="color: rgba(255,255,255,0.45);">{t('plan_billed_monthly')}</p>
				{:else}
					<div class="mb-1 flex items-baseline gap-1">
						<span class="text-4xl font-semibold tracking-tight text-white"
							>₩{yearlyPerMonth.toLocaleString()}</span
						>
						<span class="text-sm" style="color: rgba(255,255,255,0.45);">{t('plan_per_month')}</span
						>
					</div>
					<p class="text-sm" style="color: rgba(255,255,255,0.45);">
						{t('plan_billed_yearly_prefix', { price: YEARLY_PRICE.toLocaleString() })}
						<span class="text-emerald-400"
							>{t('plan_billed_yearly_savings', { amount: yearlySavings.toLocaleString() })}</span
						>
					</p>
				{/if}
			</div>

			<ul class="mb-7 flex flex-col gap-3.5">
				{#each page.proFeatures as feature (feature.text)}
					<li class="flex items-start gap-3 text-sm">
						<div
							class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full"
							style="background: rgba(255,255,255,0.12);"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								class="size-3 text-white/80"
								aria-hidden="true"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
							</svg>
						</div>
						<span style="color: rgba(255,255,255,0.8);">{feature.text}</span>
					</li>
				{/each}
			</ul>

			<p class="mb-5 text-xs leading-relaxed" style="color: rgba(255,255,255,0.3);">
				{t('plan_frequency_note')}
			</p>

			<div class="mt-auto">
				{#if page.currentPlan === 'pro'}
					<button
						type="button"
						disabled
						class="w-full cursor-default rounded-xl py-3 text-sm font-medium"
						style="background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5);"
					>
						{t('plan_current')}
					</button>
				{:else}
					<button
						type="button"
						onclick={page.handleUpgrade}
						disabled={page.model.loading}
						class="w-full rounded-xl bg-white py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-all duration-200 hover:bg-zinc-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
					>
						{page.upgradeButtonLabel}
					</button>
				{/if}
			</div>
		</div>
	</div>

	<!-- ── Data policy note ───────────────────────────────────────── -->
	<div
		class="flex items-start gap-4 rounded-3xl border border-zinc-200/60 bg-white/60 p-5 shadow-sm backdrop-blur-sm"
	>
		<div
			class="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-zinc-100 to-stone-100 text-zinc-600 shadow-sm"
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="size-5"
				aria-hidden="true"
			>
				<polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
				<polyline points="16 7 22 7 22 13" />
			</svg>
		</div>
		<div>
			<p class="text-sm font-semibold text-zinc-900">
				{t('plan_data_policy_title')}
			</p>
			<p class="mt-1 text-xs leading-relaxed text-zinc-500">
				{t('plan_data_policy_desc')}
			</p>
		</div>
	</div>

	<!-- ── Comparison table ───────────────────────────────────────── -->
	<div>
		<div class="mb-5 flex items-center gap-4">
			<div
				class="flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-zinc-100 to-stone-100 text-zinc-600 shadow-sm"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-5"
					aria-hidden="true"
				>
					<path
						d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"
					/>
				</svg>
			</div>
			<h2 class="text-2xl font-semibold tracking-tight text-zinc-900">
				{t('plan_comparison_title')}
			</h2>
		</div>

		<div
			class="overflow-x-auto rounded-3xl border border-zinc-200/60 bg-white/60 shadow-sm backdrop-blur-sm"
		>
			<table class="w-full min-w-0 text-xs sm:text-sm">
				<thead>
					<tr class="border-b border-zinc-100">
						<th
							class="px-3 py-3 text-left text-[9px] font-semibold tracking-wider text-zinc-400 uppercase sm:px-6 sm:py-4"
							style="width: 40%;">{t('plan_feature_col')}</th
						>
						<th
							class="px-2 py-3 text-center text-[9px] font-semibold tracking-wider text-zinc-400 uppercase sm:px-6 sm:py-4"
							>Free</th
						>
						<th
							class="px-2 py-3 text-center text-[9px] font-semibold tracking-wider text-zinc-600 uppercase sm:px-6 sm:py-4"
							>Pro</th
						>
					</tr>
				</thead>
				<tbody>
					{#each page.comparisonRows as row, i (row.label)}
						<tr
							class="{i < page.comparisonRows.length - 1
								? 'border-b border-zinc-100/80'
								: ''} transition-colors hover:bg-zinc-50/40"
						>
							<td class="px-3 py-3 font-medium text-zinc-700 sm:px-6 sm:py-3.5">{row.label}</td>
							<td class="px-2 py-3 text-center text-zinc-400 sm:px-6 sm:py-3.5">{row.free}</td>
							<td
								class="px-2 py-3 text-center font-semibold sm:px-6 sm:py-3.5 {row.pro === row.free
									? 'text-zinc-400'
									: 'text-zinc-900'}">{row.pro}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- ── FAQ ────────────────────────────────────────────────────── -->
	<div>
		<div class="mb-5 flex items-center gap-4">
			<div
				class="flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-zinc-100 to-stone-100 text-zinc-600 shadow-sm"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-5"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="10" />
					<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
					<line x1="12" y1="17" x2="12.01" y2="17" />
				</svg>
			</div>
			<h2 class="text-2xl font-semibold tracking-tight text-zinc-900">{t('plan_faq_title')}</h2>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{#each page.faqItems as faq (faq.q)}
				<div
					class="rounded-3xl border border-zinc-200/60 bg-white/60 p-6 shadow-sm backdrop-blur-sm"
				>
					<h3 class="mb-2 text-sm font-semibold text-zinc-900">{faq.q}</h3>
					<p class="text-sm leading-relaxed text-zinc-500">{faq.a}</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- ── Trust signals ──────────────────────────────────────────── -->
	<div class="flex flex-wrap items-center justify-center gap-6 pb-4">
		{#each page.trustSignals as signal (signal.icon)}
			<div class="flex items-center gap-2 text-sm text-zinc-500">
				{#if signal.icon === 'shield'}
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="size-4 shrink-0 text-zinc-400"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
						/>
					</svg>
				{:else if signal.icon === 'refresh'}
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="size-4 shrink-0 text-zinc-400"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
						/>
					</svg>
				{:else}
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="size-4 shrink-0 text-zinc-400"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M20.25 6.375c0 8.485-7.5 11.9-7.5 11.9s-7.5-3.415-7.5-11.9a7.5 7.5 0 0 1 15 0Z"
						/>
					</svg>
				{/if}
				<span>{signal.text}</span>
			</div>
		{/each}
	</div>
</div>
