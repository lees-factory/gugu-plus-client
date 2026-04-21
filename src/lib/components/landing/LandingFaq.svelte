<script lang="ts">
	import { t } from '$lib/i18n/t';

	/**
	 * 랜딩 FAQ 섹션. `<details>`/`<summary>` 기반 아코디언.
	 * - 네이티브 접근성(키보드 탐색, 스크린 리더) 기본 제공
	 * - JS 없이도 동작 → SSR 로 렌더된 상태 그대로 사용 가능
	 * - FAQPage JSON-LD 와 Q/A 내용 1:1 매칭 (구글이 "fake schema" 판단 안 하도록)
	 *
	 * 항목을 추가/제거할 때는 `(app)/+page.svelte` 의 `faqItems` 배열도 함께 갱신해야
	 * schema 와 visible UI 가 일치한다.
	 */

	type FaqKey = {
		q: Parameters<typeof t>[0];
		a: Parameters<typeof t>[0];
	};

	const FAQS: FaqKey[] = [
		{ q: 'landing_faq_q1', a: 'landing_faq_a1' },
		{ q: 'landing_faq_q2', a: 'landing_faq_a2' },
		{ q: 'landing_faq_q3', a: 'landing_faq_a3' },
		{ q: 'landing_faq_q4', a: 'landing_faq_a4' },
		{ q: 'landing_faq_q5', a: 'landing_faq_a5' },
		{ q: 'landing_faq_q6', a: 'landing_faq_a6' },
		{ q: 'landing_faq_q7', a: 'landing_faq_a7' },
		{ q: 'landing_faq_q8', a: 'landing_faq_a8' },
		{ q: 'landing_faq_q9', a: 'landing_faq_a9' },
		{ q: 'landing_faq_q10', a: 'landing_faq_a10' }
	];
</script>

<section class="px-5 py-16 sm:px-8 sm:py-24">
	<div class="mx-auto max-w-3xl">
		<!-- Section header -->
		<div class="mb-10 text-center">
			<div
				class="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200/60 bg-white/80 px-3 py-1.5 backdrop-blur-sm"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-3.5 text-stone-600"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="9" />
					<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
					<path d="M12 17h.01" />
				</svg>
				<span class="text-xs font-semibold text-stone-800">{t('landing_faq_badge')}</span>
			</div>
			<h2 class="text-2xl font-bold tracking-[-0.025em] text-[#1c1917] sm:text-3xl">
				{t('landing_faq_title')}
			</h2>
			<p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-500">
				{t('landing_faq_subtitle')}
			</p>
		</div>

		<!-- Accordion -->
		<ul class="space-y-3">
			{#each FAQS as item, i (i)}
				<li>
					<details
						class="group rounded-2xl border border-zinc-200/60 bg-white shadow-sm transition-shadow open:shadow-md"
					>
						<summary
							class="flex cursor-pointer list-none items-start justify-between gap-4 p-5 sm:p-6"
						>
							<span class="text-sm leading-6 font-semibold text-[#1c1917] sm:text-base">
								{t(item.q)}
							</span>
							<span
								class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-transform duration-200 group-open:rotate-180 group-open:border-zinc-900 group-open:bg-zinc-900 group-open:text-white"
								aria-hidden="true"
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="size-3.5"
								>
									<path d="m6 9 6 6 6-6" />
								</svg>
							</span>
						</summary>
						<div class="border-t border-zinc-100 px-5 pt-4 pb-5 sm:px-6 sm:pb-6">
							<p class="text-sm leading-relaxed text-zinc-600 sm:text-[15px]">
								{t(item.a)}
							</p>
						</div>
					</details>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	/* 기본 summary 삼각형 마커 제거 (Safari 포함) */
	summary::-webkit-details-marker {
		display: none;
	}
	summary::marker {
		content: '';
	}
</style>
