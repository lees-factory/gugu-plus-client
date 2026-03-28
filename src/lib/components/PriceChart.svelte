<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '$lib/i18n/t';
	import type { ChartEntry } from './price-chart.svelte';
	import { createPriceChartModel } from './price-chart.svelte';

	let { data }: { data: ChartEntry[] } = $props();

	const chart = createPriceChartModel(() => data);
</script>

<!-- 기간 선택 탭 -->
<div class="mb-4 flex items-center gap-1">
	{#each chart.periods as p (p.value)}
		{@const locked = p.proOnly && !chart.isPro}
		<button
			type="button"
			onclick={() => {
				if (!locked) chart.selectedPeriod = p.value;
			}}
			class="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition"
			style="
				background-color: {chart.selectedPeriod === p.value ? '#2d2d2a' : '#f7f6f3'};
				color: {chart.selectedPeriod === p.value
				? '#ffffff'
				: locked
					? 'rgba(107,107,101,0.4)'
					: '#6b6b65'};
				cursor: {locked ? 'default' : 'pointer'};
			"
		>
			{p.label}
			{#if locked}
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					style="width:10px;height:10px;opacity:0.4;"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
					/>
				</svg>
			{/if}
		</button>
	{/each}
</div>

<!-- SVG 차트 -->
<div
	class="overflow-hidden rounded-xl"
	style="background-color: #fafaf8; border: 1px solid rgba(45,45,42,0.06);"
>
	<svg
		viewBox="0 0 {chart.VW} {chart.VH}"
		class="w-full"
		style="display: block;"
		role="img"
		aria-label={t('chart_aria_label')}
		onmousemove={chart.onMouseMove}
		onmouseleave={chart.clearHover}
	>
		<defs>
			<linearGradient id="pcFill" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stop-color="#5aad9c" stop-opacity="0.18" />
				<stop offset="100%" stop-color="#5aad9c" stop-opacity="0" />
			</linearGradient>
		</defs>

		<!-- Y축 그리드 -->
		{#each chart.yGrid as g (g.y)}
			<line
				x1={chart.PL}
				y1={g.y}
				x2={chart.VW - chart.PR}
				y2={g.y}
				stroke="rgba(45,45,42,0.06)"
				stroke-width="1"
			/>
			<text x={chart.PL - 6} y={g.y + 4} text-anchor="end" font-size="9.5" fill="#9b9b95">
				{chart.fmtShort(g.price)}
			</text>
		{/each}

		<!-- X축 레이블 -->
		{#each chart.xLabels as lbl (lbl.x)}
			<text x={lbl.x} y={chart.VH - 8} text-anchor="middle" font-size="9.5" fill="#9b9b95">
				{lbl.label}
			</text>
		{/each}

		<!-- 그라디언트 채우기 -->
		{#if chart.fillPath}
			<path d={chart.fillPath} fill="url(#pcFill)" />
		{/if}

		<!-- 라인 -->
		{#if chart.linePath}
			<path
				d={chart.linePath}
				fill="none"
				stroke="#5aad9c"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		{/if}

		<!-- 1건일 때 단일 점 표시 (pulse 애니메이션) -->
		{#if chart.svgPoints.length === 1}
			<circle
				cx={chart.svgPoints[0].x}
				cy={chart.svgPoints[0].y}
				r="10"
				fill="#5aad9c"
				fill-opacity="0.08"
			>
				<animate attributeName="r" values="8;14;8" dur="2.4s" repeatCount="indefinite" />
				<animate attributeName="fill-opacity" values="0.12;0.04;0.12" dur="2.4s" repeatCount="indefinite" />
			</circle>
			<circle
				cx={chart.svgPoints[0].x}
				cy={chart.svgPoints[0].y}
				r="5"
				fill="#5aad9c"
			>
				<animate attributeName="r" values="4.5;6;4.5" dur="2.4s" repeatCount="indefinite" />
			</circle>
			<text
				x={chart.svgPoints[0].x}
				y={chart.svgPoints[0].y - 16}
				text-anchor="middle"
				font-size="11"
				font-weight="600"
				fill="#1a1a17"
			>
				{chart.fmt(chart.svgPoints[0].price)}
			</text>
		{/if}

		<!-- 최저·최고 마커 (Pro) -->
		{#if chart.isPro && chart.svgPoints.length > 0}
			{#if chart.minIdx >= 0}
				<circle
					cx={chart.svgPoints[chart.minIdx].x}
					cy={chart.svgPoints[chart.minIdx].y}
					r="3.5"
					fill="#5aad9c"
				/>
				<circle
					cx={chart.svgPoints[chart.minIdx].x}
					cy={chart.svgPoints[chart.minIdx].y}
					r="6"
					fill="#5aad9c"
					fill-opacity="0.15"
				/>
			{/if}
			{#if chart.maxIdx >= 0 && chart.maxIdx !== chart.minIdx}
				<circle
					cx={chart.svgPoints[chart.maxIdx].x}
					cy={chart.svgPoints[chart.maxIdx].y}
					r="3.5"
					fill="#d4183d"
				/>
				<circle
					cx={chart.svgPoints[chart.maxIdx].x}
					cy={chart.svgPoints[chart.maxIdx].y}
					r="6"
					fill="#d4183d"
					fill-opacity="0.15"
				/>
			{/if}
		{/if}

		<!-- 호버 요소 -->
		{#if chart.hoverPt && chart.hoverIdx !== null}
			<line
				x1={chart.hoverPt.x}
				y1={chart.PT}
				x2={chart.hoverPt.x}
				y2={chart.PT + chart.cH}
				stroke="rgba(45,45,42,0.18)"
				stroke-width="1"
				stroke-dasharray="3,3"
			/>
			<circle
				cx={chart.hoverPt.x}
				cy={chart.hoverPt.y}
				r="4.5"
				fill="#5aad9c"
				stroke="white"
				stroke-width="2"
			/>

			<!-- 툴팁 -->
			<rect
				x={chart.tooltipX}
				y={chart.tooltipY}
				width="110"
				height="42"
				rx="7"
				fill="white"
				style="filter: drop-shadow(0 2px 10px rgba(0,0,0,0.1));"
			/>
			<rect
				x={chart.tooltipX}
				y={chart.tooltipY}
				width="110"
				height="42"
				rx="7"
				fill="none"
				stroke="rgba(45,45,42,0.07)"
				stroke-width="1"
			/>
			<text x={chart.tooltipX + 10} y={chart.tooltipY + 14} font-size="9.5" fill="#9b9b95">
				{chart.chartData[chart.hoverIdx].date}
			</text>
			<text
				x={chart.tooltipX + 10}
				y={chart.tooltipY + 30}
				font-size="12"
				font-weight="600"
				fill="#1a1a17"
			>
				{chart.fmt(chart.hoverPt.price)}
			</text>
			{#if chart.chartData[chart.hoverIdx].change !== 0}
				<text
					x={chart.tooltipX + 100}
					y={chart.tooltipY + 30}
					font-size="9"
					font-weight="500"
					text-anchor="end"
					fill={chart.changeColor(chart.chartData[chart.hoverIdx].change)}
				>
					{chart.chartData[chart.hoverIdx].change > 0 ? '+' : ''}{chart.fmtShort(
						chart.chartData[chart.hoverIdx].change
					)}
				</text>
			{/if}
		{/if}
	</svg>
</div>

<!-- 통계 -->
{#if chart.isPro && chart.stats}
	<div class="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
		<div class="rounded-xl p-4" style="background-color: #f7f6f3;">
			<p class="mb-1.5 text-xs" style="color: #9b9b95;">{t('chart_stat_min')}</p>
			<p class="text-sm font-semibold tabular-nums" style="color: #5aad9c;">
				{chart.fmt(chart.stats.min)}
			</p>
		</div>
		<div class="rounded-xl p-4" style="background-color: #f7f6f3;">
			<p class="mb-1.5 text-xs" style="color: #9b9b95;">{t('chart_stat_max')}</p>
			<p class="text-sm font-semibold tabular-nums" style="color: #d4183d;">
				{chart.fmt(chart.stats.max)}
			</p>
		</div>
		<div class="rounded-xl p-4" style="background-color: #f7f6f3;">
			<p class="mb-1.5 text-xs" style="color: #9b9b95;">{t('chart_stat_avg')}</p>
			<p class="text-sm font-semibold tabular-nums" style="color: #1a1a17;">
				{chart.fmt(chart.stats.avg)}
			</p>
		</div>
		<div class="rounded-xl p-4" style="background-color: #f7f6f3;">
			<p class="mb-1.5 text-xs" style="color: #9b9b95;">{t('chart_stat_change')}</p>
			<p
				class="text-sm font-semibold tabular-nums"
				style="color: {chart.stats.change <= 0 ? '#5aad9c' : '#d4183d'};"
			>
				{chart.stats.change >= 0 ? '+' : ''}{chart.stats.change.toFixed(1)}%
			</p>
		</div>
	</div>
{:else if !chart.isPro && chart.stats}
	<!-- Free 플랜: 통계 잠금 -->
	<div class="relative mt-4">
		<div
			class="grid grid-cols-2 gap-2.5 sm:grid-cols-4"
			style="filter: blur(5px); pointer-events: none; user-select: none;"
		>
			{#each [t('chart_stat_min'), t('chart_stat_max'), t('chart_stat_avg'), t('chart_stat_change')] as label (label)}
				<div class="rounded-xl p-4" style="background-color: #f7f6f3;">
					<p class="mb-1.5 text-xs" style="color: #9b9b95;">{label}</p>
					<p class="text-sm font-semibold" style="color: #1a1a17;">₩000,000</p>
				</div>
			{/each}
		</div>
		<div class="absolute inset-0 flex items-center justify-center">
			<div
				class="flex items-center gap-2 rounded-xl px-4 py-2.5"
				style="background: white; border: 1px solid rgba(45,45,42,0.1); box-shadow: 0 2px 12px rgba(0,0,0,0.08);"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="size-3.5 shrink-0"
					style="color: #6b6b65;"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
					/>
				</svg>
				<span class="text-xs" style="color: #6b6b65;">{t('chart_pro_lock')} </span>
				<a
					href={resolve('/plan')}
					class="text-xs font-semibold"
					style="color: #1a1a17; text-decoration: underline; text-underline-offset: 2px;"
					>{t('chart_pro_link')}</a
				>
				<span class="text-xs" style="color: #6b6b65;">{t('chart_pro_suffix')}</span>
			</div>
		</div>
	</div>
{/if}
