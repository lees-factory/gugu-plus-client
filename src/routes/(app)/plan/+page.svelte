<script lang="ts">
	import {
		MONTHLY_PRICE,
		YEARLY_PRICE,
		comparisonRows,
		createPlanPage,
		faqItems,
		freeFeatures,
		proFeatures,
		trustSignals,
		yearlyPerMonth,
		yearlySavings
	} from './plan-page.svelte';

	const page = createPlanPage();
</script>

<div class="space-y-10 p-6 sm:p-8 lg:p-10">
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
			<span class="text-xs font-semibold text-stone-800">Price Eye 플랜</span>
		</div>
		<h1 class="text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
			나에게 맞는 플랜을<br />
			<span class="text-zinc-600">선택하세요</span>
		</h1>
		<p class="mt-6 text-base leading-relaxed text-zinc-600">
			매일 1회 가격을 수집해 장기 히스토리 데이터를 쌓아드립니다.<br
				class="hidden sm:block"
			/>
			지금 시작할수록 더 풍부한 데이터가 쌓입니다.
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
				<p class="text-sm font-semibold text-zinc-900">현재 Free 플랜 사용 중</p>
				<p class="mt-0.5 text-xs text-zinc-500">
					Pro로 업그레이드하면 50개 상품과 무제한 히스토리를 사용할 수 있어요.
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
				<p class="text-sm font-semibold text-zinc-900">현재 Pro 플랜 사용 중</p>
				<p class="mt-0.5 text-xs text-zinc-500">모든 기능을 이용할 수 있어요.</p>
			</div>
		</div>
	{/if}

	<!-- ── Billing toggle ─────────────────────────────────────────── -->
	<div class="flex justify-center">
		<div class="flex gap-1.5 rounded-2xl bg-zinc-50/80 p-1.5 border border-zinc-200/60">
			<button
				type="button"
				onclick={() => page.setBillingCycle('monthly')}
				class="rounded-xl px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200
					{page.model.billingCycle === 'monthly'
					? 'bg-white text-stone-800 shadow-sm ring-1 ring-zinc-200/80'
					: 'text-zinc-600 hover:bg-zinc-100/60 hover:text-zinc-900'}"
			>
				월간 결제
			</button>
			<button
				type="button"
				onclick={() => page.setBillingCycle('yearly')}
				class="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200
					{page.model.billingCycle === 'yearly'
					? 'bg-white text-stone-800 shadow-sm ring-1 ring-zinc-200/80'
					: 'text-zinc-600 hover:bg-zinc-100/60 hover:text-zinc-900'}"
			>
				연간 결제
				<span
					class="rounded-full border border-emerald-100/50 bg-linear-to-r from-emerald-50 to-teal-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700"
				>
					29% 할인
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
							현재 플랜
						</span>
					{/if}
				</div>
				<div class="mb-1 flex items-baseline gap-1">
					<span class="text-4xl font-semibold tracking-tight text-zinc-900">₩0</span>
				</div>
				<p class="text-sm text-zinc-500">영원히 무료</p>
			</div>

			<ul class="mb-7 flex flex-col gap-3.5">
				{#each freeFeatures as feature (feature.text)}
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
						class="w-full rounded-xl border border-zinc-200/60 bg-zinc-50/80 py-3 text-sm font-medium text-zinc-400 cursor-default"
					>
						현재 플랜
					</button>
				{:else}
					<button
						type="button"
						class="w-full rounded-xl border border-zinc-200/60 bg-white py-3 text-sm font-medium text-zinc-600 transition-all duration-200 hover:bg-zinc-50 hover:text-zinc-900"
					>
						다운그레이드
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
					class="rounded-full border border-zinc-700/40 bg-zinc-800 px-4 py-1 text-[11px] font-semibold tracking-wider text-white/90 shadow-sm whitespace-nowrap uppercase"
				>
					가장 인기
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
							현재 플랜
						</span>
					{/if}
				</div>

				{#if page.model.billingCycle === 'monthly'}
					<div class="mb-1 flex items-baseline gap-1">
						<span class="text-4xl font-semibold tracking-tight text-white"
							>₩{MONTHLY_PRICE.toLocaleString()}</span
						>
						<span class="text-sm" style="color: rgba(255,255,255,0.45);">/ 월</span>
					</div>
					<p class="text-sm" style="color: rgba(255,255,255,0.45);">매월 청구</p>
				{:else}
					<div class="mb-1 flex items-baseline gap-1">
						<span class="text-4xl font-semibold tracking-tight text-white"
							>₩{yearlyPerMonth.toLocaleString()}</span
						>
						<span class="text-sm" style="color: rgba(255,255,255,0.45);">/ 월</span>
					</div>
					<p class="text-sm" style="color: rgba(255,255,255,0.45);">
						연 ₩{YEARLY_PRICE.toLocaleString()} 청구 ·
						<span class="text-emerald-400">₩{yearlySavings.toLocaleString()} 절약</span>
					</p>
				{/if}
			</div>

			<ul class="mb-7 flex flex-col gap-3.5">
				{#each proFeatures as feature (feature.text)}
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
				* 주기 변경 시 이후 수집 데이터부터 적용됩니다. 기존 데이터는 그대로 보존됩니다.
			</p>

			<div class="mt-auto">
				{#if page.currentPlan === 'pro'}
					<button
						type="button"
						disabled
						class="w-full rounded-xl py-3 text-sm font-medium cursor-default"
						style="background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5);"
					>
						현재 플랜
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
			<p class="text-sm font-semibold text-zinc-900">Daily price tracking for long-term insights.</p>
			<p class="mt-1 text-xs leading-relaxed text-zinc-500">
				Price Eye는 매일 1회 가격을 수집해 장기 히스토리 데이터를 쌓아드립니다. 빠른 알림 서비스가
				아닌, 데이터 기반 구매 판단 도구입니다.
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
			<h2 class="text-2xl font-semibold tracking-tight text-zinc-900">플랜 비교</h2>
		</div>

		<div class="overflow-hidden rounded-3xl border border-zinc-200/60 bg-white/60 shadow-sm backdrop-blur-sm">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-zinc-100">
						<th
							class="px-6 py-4 text-left text-[9px] font-semibold uppercase tracking-wider text-zinc-400"
							style="width: 50%;">기능</th
						>
						<th class="px-6 py-4 text-center text-[9px] font-semibold uppercase tracking-wider text-zinc-400"
							>Free</th
						>
						<th class="px-6 py-4 text-center text-[9px] font-semibold uppercase tracking-wider text-zinc-600"
							>Pro</th
						>
					</tr>
				</thead>
				<tbody>
					{#each comparisonRows as row, i (row.label)}
						<tr
							class="{i < comparisonRows.length - 1 ? 'border-b border-zinc-100/80' : ''} transition-colors hover:bg-zinc-50/40"
						>
							<td class="px-6 py-3.5 font-medium text-zinc-700">{row.label}</td>
							<td class="px-6 py-3.5 text-center text-zinc-400">{row.free}</td>
							<td
								class="px-6 py-3.5 text-center font-semibold {row.pro === row.free
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
			<h2 class="text-2xl font-semibold tracking-tight text-zinc-900">자주 묻는 질문</h2>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{#each faqItems as faq (faq.q)}
				<div class="rounded-3xl border border-zinc-200/60 bg-white/60 p-6 shadow-sm backdrop-blur-sm">
					<h3 class="mb-2 text-sm font-semibold text-zinc-900">{faq.q}</h3>
					<p class="text-sm leading-relaxed text-zinc-500">{faq.a}</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- ── Trust signals ──────────────────────────────────────────── -->
	<div class="flex flex-wrap items-center justify-center gap-6 pb-4">
		{#each trustSignals as signal (signal.icon)}
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
