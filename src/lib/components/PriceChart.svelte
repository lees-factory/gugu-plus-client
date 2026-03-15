<script lang="ts">
	import { auth } from '$lib/stores/auth.svelte';

	type Entry = { date: string; price: number; change: number };

	let { data }: { data: Entry[] } = $props();

	const isPro = $derived(auth.plan.type === 'pro');

	type Period = '7' | '14' | '30' | '90' | 'all';

	let selectedPeriod = $state<Period>('14');

	// 다운그레이드 시 기간 리셋
	$effect(() => {
		if (!isPro && (selectedPeriod === '30' || selectedPeriod === '90' || selectedPeriod === 'all')) {
			selectedPeriod = '14';
		}
	});

	const periods: { value: Period; label: string; proOnly: boolean }[] = [
		{ value: '7', label: '7일', proOnly: false },
		{ value: '14', label: '14일', proOnly: false },
		{ value: '30', label: '30일', proOnly: true },
		{ value: '90', label: '90일', proOnly: true },
		{ value: 'all', label: '전체', proOnly: true }
	];

	// data는 최신순(newest first). slice 후 reverse → 오래된것→최신 (차트 왼쪽→오른쪽)
	const chartData = $derived.by(() => {
		const n =
			selectedPeriod === 'all'
				? data.length
				: selectedPeriod === '7'
					? 7
					: selectedPeriod === '14'
						? 14
						: selectedPeriod === '30'
							? 30
							: 90;
		return [...data.slice(0, Math.min(n, data.length))].reverse();
	});

	// 통계
	const stats = $derived.by(() => {
		if (chartData.length === 0) return null;
		const prices = chartData.map((d) => d.price);
		const min = Math.min(...prices);
		const max = Math.max(...prices);
		const avg = Math.round(prices.reduce((s, p) => s + p, 0) / prices.length);
		const first = chartData[0].price;
		const last = chartData[chartData.length - 1].price;
		const change = first === 0 ? 0 : ((last - first) / first) * 100;
		return { min, max, avg, change };
	});

	// SVG 레이아웃
	const VW = 600;
	const VH = 210;
	const PL = 68;
	const PR = 16;
	const PT = 18;
	const PB = 34;
	const cW = VW - PL - PR;
	const cH = VH - PT - PB;

	const svgPoints = $derived.by(() => {
		if (chartData.length < 2) return [];
		const prices = chartData.map((d) => d.price);
		const lo = Math.min(...prices);
		const hi = Math.max(...prices);
		const range = hi - lo || lo * 0.1 || 1;
		const yMin = lo - range * 0.15;
		const yMax = hi + range * 0.15;
		const yRange = yMax - yMin;
		const n = chartData.length;
		return chartData.map((d, i) => ({
			x: PL + (i / (n - 1)) * cW,
			y: PT + (1 - (d.price - yMin) / yRange) * cH,
			price: d.price,
			date: d.date
		}));
	});

	// Y축 그리드 (4분할)
	const yGrid = $derived.by(() => {
		if (chartData.length === 0) return [];
		const prices = chartData.map((d) => d.price);
		const lo = Math.min(...prices);
		const hi = Math.max(...prices);
		const range = hi - lo || lo * 0.1 || 1;
		const yMin = lo - range * 0.15;
		const yMax = hi + range * 0.15;
		const yRange = yMax - yMin;
		return [0, 0.25, 0.5, 0.75, 1].map((t) => ({
			y: PT + (1 - t) * cH,
			price: Math.round(yMin + yRange * t)
		}));
	});

	// X축 레이블 (최대 6개)
	const xLabels = $derived.by(() => {
		const pts = svgPoints;
		if (pts.length === 0) return [];
		const maxL = Math.min(6, pts.length);
		const step = (pts.length - 1) / (maxL - 1);
		const seen = new Set<number>();
		return Array.from({ length: maxL }, (_, i) => {
			const idx = Math.round(i * step);
			if (seen.has(idx)) return null;
			seen.add(idx);
			return {
				x: pts[idx].x,
				label: chartData[idx].date.replace('월 ', '/').replace('일', '')
			};
		}).filter(Boolean) as { x: number; label: string }[];
	});

	// 최저가·최고가 인덱스 (마커용)
	const minIdx = $derived(
		chartData.length === 0
			? -1
			: chartData.reduce((best, d, i) => (d.price < chartData[best].price ? i : best), 0)
	);
	const maxIdx = $derived(
		chartData.length === 0
			? -1
			: chartData.reduce((best, d, i) => (d.price > chartData[best].price ? i : best), 0)
	);

	// 스무스 베지어 경로
	function buildPath(pts: { x: number; y: number }[]): string {
		if (pts.length < 2) return '';
		let d = `M${pts[0].x},${pts[0].y}`;
		for (let i = 1; i < pts.length; i++) {
			const p = pts[i - 1];
			const c = pts[i];
			const mx = (p.x + c.x) / 2;
			d += ` C${mx},${p.y} ${mx},${c.y} ${c.x},${c.y}`;
		}
		return d;
	}

	const linePath = $derived(buildPath(svgPoints));
	const fillPath = $derived(
		svgPoints.length >= 2
			? `${linePath} L${svgPoints[svgPoints.length - 1].x},${PT + cH} L${svgPoints[0].x},${PT + cH} Z`
			: ''
	);

	// 호버
	let hoverIdx = $state<number | null>(null);
	const hoverPt = $derived(hoverIdx !== null ? svgPoints[hoverIdx] : null);

	function onMouseMove(e: MouseEvent) {
		const svg = e.currentTarget as SVGSVGElement;
		const rect = svg.getBoundingClientRect();
		const mx = ((e.clientX - rect.left) / rect.width) * VW;
		if (svgPoints.length === 0) return;
		let best = 0;
		let bestD = Infinity;
		for (let i = 0; i < svgPoints.length; i++) {
			const d = Math.abs(svgPoints[i].x - mx);
			if (d < bestD) {
				bestD = d;
				best = i;
			}
		}
		hoverIdx = best;
	}

	function fmt(n: number) {
		return `₩${n.toLocaleString('ko-KR')}`;
	}

	function fmtShort(n: number) {
		if (Math.abs(n) >= 10000) {
			const v = n / 10000;
			return `${v % 1 === 0 ? v : v.toFixed(1)}만`;
		}
		return n.toLocaleString();
	}

	// 툴팁 위치 (가장자리 클리핑)
	const tooltipX = $derived(
		hoverPt ? (hoverPt.x + 118 > VW ? hoverPt.x - 120 : hoverPt.x + 10) : 0
	);
	const tooltipY = $derived(hoverPt ? Math.max(PT, hoverPt.y - 36) : 0);

	// 변동 색
	function changeColor(v: number) {
		return v < 0 ? '#5aad9c' : v > 0 ? '#d4183d' : '#6b6b65';
	}
</script>

<!-- 기간 선택 탭 -->
<div class="mb-4 flex items-center gap-1">
	{#each periods as p}
		{@const locked = p.proOnly && !isPro}
		<button
			type="button"
			onclick={() => { if (!locked) selectedPeriod = p.value; }}
			class="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition"
			style="
				background-color: {selectedPeriod === p.value ? '#2d2d2a' : '#f7f6f3'};
				color: {selectedPeriod === p.value ? '#ffffff' : locked ? 'rgba(107,107,101,0.4)' : '#6b6b65'};
				cursor: {locked ? 'default' : 'pointer'};
			"
		>
			{p.label}
			{#if locked}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:10px;height:10px;opacity:0.4;" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
				</svg>
			{/if}
		</button>
	{/each}
</div>

<!-- SVG 차트 -->
<div class="rounded-xl overflow-hidden" style="background-color: #fafaf8; border: 1px solid rgba(45,45,42,0.06);">
	<svg
		viewBox="0 0 {VW} {VH}"
		class="w-full"
		style="display: block;"
		onmousemove={onMouseMove}
		onmouseleave={() => (hoverIdx = null)}
	>
		<defs>
			<linearGradient id="pcFill" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stop-color="#5aad9c" stop-opacity="0.18" />
				<stop offset="100%" stop-color="#5aad9c" stop-opacity="0" />
			</linearGradient>
		</defs>

		<!-- Y축 그리드 -->
		{#each yGrid as g}
			<line
				x1={PL} y1={g.y}
				x2={VW - PR} y2={g.y}
				stroke="rgba(45,45,42,0.06)" stroke-width="1"
			/>
			<text x={PL - 6} y={g.y + 4} text-anchor="end" font-size="9.5" fill="#9b9b95">
				{fmtShort(g.price)}
			</text>
		{/each}

		<!-- X축 레이블 -->
		{#each xLabels as lbl}
			<text x={lbl.x} y={VH - 8} text-anchor="middle" font-size="9.5" fill="#9b9b95">
				{lbl.label}
			</text>
		{/each}

		<!-- 그라디언트 채우기 -->
		{#if fillPath}
			<path d={fillPath} fill="url(#pcFill)" />
		{/if}

		<!-- 라인 -->
		{#if linePath}
			<path
				d={linePath}
				fill="none"
				stroke="#5aad9c"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		{/if}

		<!-- 최저·최고 마커 (Pro) -->
		{#if isPro && svgPoints.length > 0}
			{#if minIdx >= 0}
				<circle cx={svgPoints[minIdx].x} cy={svgPoints[minIdx].y} r="3.5" fill="#5aad9c" />
				<circle cx={svgPoints[minIdx].x} cy={svgPoints[minIdx].y} r="6" fill="#5aad9c" fill-opacity="0.15" />
			{/if}
			{#if maxIdx >= 0 && maxIdx !== minIdx}
				<circle cx={svgPoints[maxIdx].x} cy={svgPoints[maxIdx].y} r="3.5" fill="#d4183d" />
				<circle cx={svgPoints[maxIdx].x} cy={svgPoints[maxIdx].y} r="6" fill="#d4183d" fill-opacity="0.15" />
			{/if}
		{/if}

		<!-- 호버 요소 -->
		{#if hoverPt && hoverIdx !== null}
			<line
				x1={hoverPt.x} y1={PT}
				x2={hoverPt.x} y2={PT + cH}
				stroke="rgba(45,45,42,0.18)" stroke-width="1" stroke-dasharray="3,3"
			/>
			<circle cx={hoverPt.x} cy={hoverPt.y} r="4.5" fill="#5aad9c" stroke="white" stroke-width="2" />

			<!-- 툴팁 -->
			<rect
				x={tooltipX} y={tooltipY}
				width="110" height="42" rx="7"
				fill="white"
				style="filter: drop-shadow(0 2px 10px rgba(0,0,0,0.1));"
			/>
			<rect
				x={tooltipX} y={tooltipY}
				width="110" height="42" rx="7"
				fill="none" stroke="rgba(45,45,42,0.07)" stroke-width="1"
			/>
			<text x={tooltipX + 10} y={tooltipY + 14} font-size="9.5" fill="#9b9b95">
				{chartData[hoverIdx].date}
			</text>
			<text x={tooltipX + 10} y={tooltipY + 30} font-size="12" font-weight="600" fill="#1a1a17">
				{fmt(hoverPt.price)}
			</text>
			{#if chartData[hoverIdx].change !== 0}
				<text
					x={tooltipX + 100} y={tooltipY + 30}
					font-size="9" font-weight="500"
					text-anchor="end"
					fill={changeColor(chartData[hoverIdx].change)}
				>
					{chartData[hoverIdx].change > 0 ? '+' : ''}{fmtShort(chartData[hoverIdx].change)}
				</text>
			{/if}
		{/if}
	</svg>
</div>

<!-- 통계 -->
{#if isPro && stats}
	<div class="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
		<div class="rounded-xl p-4" style="background-color: #f7f6f3;">
			<p class="mb-1.5 text-xs" style="color: #9b9b95;">최저가</p>
			<p class="text-sm font-semibold tabular-nums" style="color: #5aad9c;">{fmt(stats.min)}</p>
		</div>
		<div class="rounded-xl p-4" style="background-color: #f7f6f3;">
			<p class="mb-1.5 text-xs" style="color: #9b9b95;">최고가</p>
			<p class="text-sm font-semibold tabular-nums" style="color: #d4183d;">{fmt(stats.max)}</p>
		</div>
		<div class="rounded-xl p-4" style="background-color: #f7f6f3;">
			<p class="mb-1.5 text-xs" style="color: #9b9b95;">평균가</p>
			<p class="text-sm font-semibold tabular-nums" style="color: #1a1a17;">{fmt(stats.avg)}</p>
		</div>
		<div class="rounded-xl p-4" style="background-color: #f7f6f3;">
			<p class="mb-1.5 text-xs" style="color: #9b9b95;">기간 변동</p>
			<p
				class="text-sm font-semibold tabular-nums"
				style="color: {stats.change <= 0 ? '#5aad9c' : '#d4183d'};"
			>
				{stats.change >= 0 ? '+' : ''}{stats.change.toFixed(1)}%
			</p>
		</div>
	</div>
{:else if !isPro && stats}
	<!-- Free 플랜: 통계 잠금 -->
	<div class="relative mt-4">
		<div
			class="grid grid-cols-2 gap-2.5 sm:grid-cols-4"
			style="filter: blur(5px); pointer-events: none; user-select: none;"
		>
			{#each ['최저가', '최고가', '평균가', '기간 변동'] as label}
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
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5 shrink-0" style="color: #6b6b65;" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
				</svg>
				<span class="text-xs" style="color: #6b6b65;">고급 통계는</span>
				<a href="/plan" class="text-xs font-semibold" style="color: #1a1a17; text-decoration: underline; text-underline-offset: 2px;">Pro 플랜</a>
				<span class="text-xs" style="color: #6b6b65;">전용입니다.</span>
			</div>
		</div>
	</div>
{/if}
