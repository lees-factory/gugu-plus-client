<script lang="ts">
	import { getContext } from 'svelte';
	import { auth } from '$lib/stores/auth.svelte';

	const toggleSidebar = getContext<() => void>('toggleSidebar');

	let billingCycle = $state<'monthly' | 'yearly'>('monthly');
	let loading = $state(false);

	const monthlyPrice = 6900;
	const yearlyPrice = 59000;
	const yearlyPerMonth = Math.round(yearlyPrice / 12);
	const yearlySavings = monthlyPrice * 12 - yearlyPrice;

	const currentPlan = $derived(auth.plan.type);

	const freeFeatures = [
		{ text: '최대 5개 상품 추적', included: true },
		{ text: '매일 1회 가격 업데이트 (24h)', included: true },
		{ text: '최근 14일 가격 히스토리', included: true },
		{ text: '기본 가격 그래프', included: true },
		{ text: '이메일 알림', included: true },
		{ text: '무제한 가격 히스토리', included: false },
		{ text: '고급 통계 (최저·최고·평균가)', included: false },
		{ text: 'CSV 내보내기', included: false }
	];

	const proFeatures = [
		{ text: '최대 50개 상품 추적', included: true },
		{ text: '매일 1회 가격 업데이트 (24h)', included: true },
		{ text: '무제한 가격 히스토리', included: true },
		{ text: '고급 통계 (최저·최고·평균가·변동률)', included: true },
		{ text: '기간별 그래프 비교 (7d / 30d / 90d)', included: true },
		{ text: '이메일 알림', included: true },
		{ text: 'CSV 내보내기', included: true }
	];

	async function handleUpgrade() {
		loading = true;
		// TODO: 실제 결제 연동
		await new Promise((r) => setTimeout(r, 1000));
		loading = false;
	}
</script>

<!-- Sticky header -->
<div
	class="sticky top-0 z-10 bg-white px-6 py-5 sm:px-8 sm:py-6"
	style="border-bottom: 1px solid rgba(45, 45, 42, 0.06);"
>
	<div class="flex items-center gap-3">
		<button
			type="button"
			onclick={toggleSidebar}
			aria-label="Toggle sidebar"
			class="flex size-9 shrink-0 items-center justify-center rounded-xl transition hover:bg-[#f7f6f3]"
			style="color: #6b6b65;"
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
			</svg>
		</button>
		<div>
			<h1 class="text-2xl font-semibold sm:text-3xl" style="color: #1a1a17; letter-spacing: -0.02em;">
				Plans
			</h1>
			<p class="mt-0.5 hidden text-sm sm:block" style="color: #6b6b65;">
				나에게 맞는 플랜을 선택하세요
			</p>
		</div>
	</div>
</div>

<!-- Content -->
<div class="p-6 sm:p-8 lg:p-10">
	<div class="mx-auto max-w-4xl">

		<!-- Current plan banner -->
		{#if currentPlan === 'free'}
			<div
				class="mb-8 flex items-center gap-4 rounded-2xl p-5"
				style="background-color: #f7f6f3; border: 1px solid rgba(45, 45, 42, 0.06);"
			>
				<div class="flex size-10 shrink-0 items-center justify-center rounded-xl" style="background-color: #e8e7e3;">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-5" style="color: #6b6b65;" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
					</svg>
				</div>
				<div>
					<p class="text-sm font-medium" style="color: #1a1a17;">현재 Free 플랜 사용 중</p>
					<p class="mt-0.5 text-xs" style="color: #6b6b65;">
						Pro로 업그레이드하면 50개 상품과 무제한 히스토리를 사용할 수 있어요.
					</p>
				</div>
			</div>
		{:else}
			<div
				class="mb-8 flex items-center gap-4 rounded-2xl p-5"
				style="background: linear-gradient(135deg, #e8f2f0 0%, #f0f9f7 100%); border: 1px solid rgba(90, 173, 156, 0.2);"
			>
				<div class="flex size-10 shrink-0 items-center justify-center rounded-xl" style="background: linear-gradient(135deg, #5aad9c 0%, #4a9384 100%);">
					<svg viewBox="0 0 24 24" fill="currentColor" class="size-5 text-white" aria-hidden="true">
						<path fill-rule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5Z" clip-rule="evenodd" />
					</svg>
				</div>
				<div>
					<p class="text-sm font-medium" style="color: #1a1a17;">현재 Pro 플랜 사용 중</p>
					<p class="mt-0.5 text-xs" style="color: #4a9384;">모든 기능을 이용할 수 있어요.</p>
				</div>
			</div>
		{/if}

		<!-- Pricing philosophy callout -->
		<div
			class="mb-8 rounded-2xl p-5"
			style="background: linear-gradient(135deg, #f7f6f3 0%, #f4f3ef 100%); border: 1px solid rgba(45, 45, 42, 0.06);"
		>
			<p class="text-sm font-medium mb-1" style="color: #1a1a17;">
				📊 Daily price tracking for long-term insights.
			</p>
			<p class="text-xs leading-relaxed" style="color: #6b6b65;">
				Gugu Plus는 매일 1회 가격을 수집해 장기 히스토리 데이터를 쌓아드립니다. 빠른 알림 서비스가 아닌, 데이터 기반 구매 판단 도구입니다. 지금 시작할수록 더 풍부한 데이터가 쌓입니다.
			</p>
		</div>

		<!-- Billing toggle -->
		<div class="mb-8 flex justify-center">
			<div class="flex items-center gap-1 rounded-xl p-1" style="background-color: #f4f3ef;">
				<button
					type="button"
					onclick={() => (billingCycle = 'monthly')}
					class="rounded-lg px-5 py-2 text-sm font-medium transition-all"
					style="
						background-color: {billingCycle === 'monthly' ? '#ffffff' : 'transparent'};
						color: {billingCycle === 'monthly' ? '#1a1a17' : '#6b6b65'};
						box-shadow: {billingCycle === 'monthly' ? '0 1px 4px rgba(45,45,42,0.08)' : 'none'};
					"
				>
					월간 결제
				</button>
				<button
					type="button"
					onclick={() => (billingCycle = 'yearly')}
					class="flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-all"
					style="
						background-color: {billingCycle === 'yearly' ? '#ffffff' : 'transparent'};
						color: {billingCycle === 'yearly' ? '#1a1a17' : '#6b6b65'};
						box-shadow: {billingCycle === 'yearly' ? '0 1px 4px rgba(45,45,42,0.08)' : 'none'};
					"
				>
					연간 결제
					<span class="rounded-md px-1.5 py-0.5 text-xs font-semibold" style="background-color: #e8f2f0; color: #4a9384;">
						29% 할인
					</span>
				</button>
			</div>
		</div>

		<!-- Plan cards -->
		<div class="grid grid-cols-1 gap-5 md:grid-cols-2">

			<!-- Free -->
			<div
				class="flex flex-col rounded-2xl bg-white p-7"
				style="border: 1px solid rgba(45, 45, 42, 0.08);"
			>
				<div class="mb-6">
					<div class="mb-4 flex items-center justify-between">
						<span class="rounded-lg px-3 py-1 text-xs font-semibold" style="background-color: #f4f3ef; color: #6b6b65;">
							FREE
						</span>
						{#if currentPlan === 'free'}
							<span class="rounded-lg px-3 py-1 text-xs font-medium" style="background-color: #f7f6f3; color: #6b6b65; border: 1px solid rgba(45,45,42,0.08);">
								현재 플랜
							</span>
						{/if}
					</div>
					<div class="mb-1 flex items-baseline gap-1">
						<span class="text-4xl font-semibold" style="color: #1a1a17;">₩0</span>
					</div>
					<p class="text-sm" style="color: #6b6b65;">영원히 무료</p>
				</div>

				<ul class="mb-7 flex flex-col gap-3.5">
					{#each freeFeatures as feature}
						<li class="flex items-start gap-3 text-sm">
							{#if feature.included}
								<div class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full" style="background-color: #e8f2f0;">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="size-3" style="color: #5aad9c;" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
									</svg>
								</div>
								<span style="color: #1a1a17;">{feature.text}</span>
							{:else}
								<div class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full" style="background-color: #f4f3ef;">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="size-3" style="color: #6b6b65; opacity: 0.4;" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
									</svg>
								</div>
								<span style="color: #6b6b65; opacity: 0.55;">{feature.text}</span>
							{/if}
						</li>
					{/each}
				</ul>

				<div class="mt-auto">
					{#if currentPlan === 'free'}
						<button
							type="button"
							disabled
							class="w-full rounded-xl py-3 text-sm font-medium"
							style="border: 1px solid rgba(45, 45, 42, 0.1); color: #6b6b65; background-color: #f7f6f3; cursor: default;"
						>
							현재 플랜
						</button>
					{:else}
						<button
							type="button"
							class="w-full rounded-xl py-3 text-sm font-medium transition-all hover:shadow-sm"
							style="border: 1px solid rgba(45, 45, 42, 0.1); color: #6b6b65; background-color: #ffffff;"
						>
							다운그레이드
						</button>
					{/if}
				</div>
			</div>

			<!-- Pro -->
			<div
				class="relative flex flex-col rounded-2xl p-7"
				style="background: linear-gradient(160deg, #2d2d2a 0%, #1a1a17 100%); border: 1px solid rgba(255,255,255,0.06);"
			>
				<div class="absolute -top-3.5 left-1/2 -translate-x-1/2">
					<span
						class="rounded-full px-4 py-1 text-xs font-semibold shadow-sm whitespace-nowrap"
						style="background: linear-gradient(135deg, #5aad9c 0%, #4a9384 100%); color: #ffffff;"
					>
						가장 인기
					</span>
				</div>

				<div class="mb-6">
					<div class="mb-4 flex items-center justify-between">
						<span class="rounded-lg px-3 py-1 text-xs font-semibold" style="background: linear-gradient(135deg, #5aad9c 0%, #4a9384 100%); color: #ffffff;">
							PRO
						</span>
						{#if currentPlan === 'pro'}
							<span class="rounded-lg px-3 py-1 text-xs font-medium" style="background-color: rgba(90,173,156,0.2); color: #5aad9c;">
								현재 플랜
							</span>
						{/if}
					</div>

					{#if billingCycle === 'monthly'}
						<div class="mb-1 flex items-baseline gap-1">
							<span class="text-4xl font-semibold text-white">₩{monthlyPrice.toLocaleString()}</span>
							<span class="text-sm" style="color: rgba(255,255,255,0.5);">/ 월</span>
						</div>
						<p class="text-sm" style="color: rgba(255,255,255,0.5);">매월 청구</p>
					{:else}
						<div class="mb-1 flex items-baseline gap-1">
							<span class="text-4xl font-semibold text-white">₩{yearlyPerMonth.toLocaleString()}</span>
							<span class="text-sm" style="color: rgba(255,255,255,0.5);">/ 월</span>
						</div>
						<p class="text-sm" style="color: rgba(255,255,255,0.5);">
							연 ₩{yearlyPrice.toLocaleString()} 청구 ·
							<span style="color: #5aad9c;">₩{yearlySavings.toLocaleString()} 절약</span>
						</p>
					{/if}
				</div>

				<ul class="mb-7 flex flex-col gap-3.5">
					{#each proFeatures as feature}
						<li class="flex items-start gap-3 text-sm">
							<div class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full" style="background-color: rgba(90,173,156,0.2);">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="size-3" style="color: #5aad9c;" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
								</svg>
							</div>
							<span style="color: rgba(255,255,255,0.85);">{feature.text}</span>
						</li>
					{/each}
				</ul>

				<!-- Data policy note -->
				<p class="mb-5 text-xs leading-relaxed" style="color: rgba(255,255,255,0.35);">
					* 주기 변경 시 이후 수집 데이터부터 적용됩니다. 기존 데이터는 그대로 보존됩니다.
				</p>

				<div class="mt-auto">
					{#if currentPlan === 'pro'}
						<button
							type="button"
							disabled
							class="w-full rounded-xl py-3 text-sm font-medium"
							style="background-color: rgba(90,173,156,0.2); color: #5aad9c; cursor: default;"
						>
							현재 플랜
						</button>
					{:else}
						<button
							type="button"
							onclick={handleUpgrade}
							disabled={loading}
							class="w-full rounded-xl py-3 text-sm font-medium transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
							style="background: linear-gradient(135deg, #5aad9c 0%, #4a9384 100%); color: #ffffff;"
						>
							{loading ? '처리 중...' : billingCycle === 'monthly' ? 'Pro로 업그레이드' : '연간 Pro로 업그레이드'}
						</button>
					{/if}
				</div>
			</div>
		</div>

		<!-- Comparison table -->
		<div class="mt-10">
			<h2 class="mb-5 text-lg font-semibold" style="color: #1a1a17; letter-spacing: -0.01em;">플랜 비교</h2>
			<div class="overflow-hidden rounded-2xl bg-white" style="border: 1px solid rgba(45, 45, 42, 0.08);">
				<table class="w-full text-sm">
					<thead>
						<tr style="border-bottom: 1px solid rgba(45, 45, 42, 0.06);">
							<th class="px-6 py-4 text-left font-medium" style="color: #6b6b65; width: 50%;">기능</th>
							<th class="px-6 py-4 text-center font-medium" style="color: #6b6b65;">Free</th>
							<th class="px-6 py-4 text-center font-medium" style="color: #1a1a17;">Pro</th>
						</tr>
					</thead>
					<tbody>
						{#each [
							{ label: '상품 추적', free: '5개', pro: '50개' },
							{ label: '업데이트 주기', free: '매일 (24h)', pro: '매일 (24h)' },
							{ label: '가격 히스토리', free: '14일', pro: '무제한' },
							{ label: '고급 통계', free: '—', pro: '최저·최고·평균가·변동률' },
							{ label: '기간별 비교', free: '—', pro: '7d / 30d / 90d' },
							{ label: 'CSV 내보내기', free: '—', pro: '✓' },
							{ label: '이메일 알림', free: '✓', pro: '✓' },
						] as row, i}
							<tr style="{i < 6 ? 'border-bottom: 1px solid rgba(45, 45, 42, 0.04);' : ''}">
								<td class="px-6 py-3.5" style="color: #1a1a17;">{row.label}</td>
								<td class="px-6 py-3.5 text-center" style="color: #6b6b65;">{row.free}</td>
								<td class="px-6 py-3.5 text-center font-medium" style="color: {row.pro === row.free ? '#6b6b65' : '#1a1a17'};">{row.pro}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- FAQ -->
		<div class="mt-10">
			<h2 class="mb-5 text-lg font-semibold" style="color: #1a1a17; letter-spacing: -0.01em;">자주 묻는 질문</h2>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{#each [
					{
						q: '언제든지 취소할 수 있나요?',
						a: '네, 언제든지 취소 가능합니다. 취소 후에도 결제 기간이 끝날 때까지 Pro 기능을 사용할 수 있어요.'
					},
					{
						q: 'Pro → Free로 다운그레이드하면 데이터는?',
						a: '데이터는 절대 삭제하지 않습니다. 다운그레이드 후에는 최근 14일 데이터만 열람 가능하며, 재구독 시 전체 히스토리가 즉시 복원됩니다.'
					},
					{
						q: '가격 업데이트 주기는 얼마나 빠른가요?',
						a: 'Gugu Plus는 매일 1회 가격을 수집합니다. 빠른 알림보다 정확한 장기 히스토리 데이터 제공을 목표로 합니다.'
					},
					{
						q: '결제 수단은 무엇이 지원되나요?',
						a: '신용카드, 체크카드, 카카오페이, 네이버페이를 지원합니다. 안전한 결제를 위해 SSL 암호화를 사용합니다.'
					}
				] as faq}
					<div class="rounded-2xl bg-white p-6" style="border: 1px solid rgba(45, 45, 42, 0.06);">
						<h3 class="mb-2 text-sm font-semibold" style="color: #1a1a17;">{faq.q}</h3>
						<p class="text-sm leading-relaxed" style="color: #6b6b65;">{faq.a}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Trust signals -->
		<div class="mt-8 flex flex-wrap items-center justify-center gap-6">
			{#each [
				{ icon: 'shield', text: 'SSL 보안 결제' },
				{ icon: 'refresh', text: '언제든 취소 가능' },
				{ icon: 'data', text: '데이터 절대 삭제 없음' }
			] as signal}
				<div class="flex items-center gap-2 text-sm" style="color: #6b6b65;">
					{#if signal.icon === 'shield'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4 shrink-0" style="color: #5aad9c;" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
						</svg>
					{:else if signal.icon === 'refresh'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4 shrink-0" style="color: #5aad9c;" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
						</svg>
					{:else}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4 shrink-0" style="color: #5aad9c;" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 8.485-7.5 11.9-7.5 11.9s-7.5-3.415-7.5-11.9a7.5 7.5 0 0 1 15 0Z" />
						</svg>
					{/if}
					<span>{signal.text}</span>
				</div>
			{/each}
		</div>

	</div>
</div>
