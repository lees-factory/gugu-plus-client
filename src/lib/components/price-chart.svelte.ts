import { t } from '$lib/i18n/t';
import { formatPrice, formatPriceShort } from '$lib/utils/format-price';

export type ChartEntry = { date: string; price: number; change: number };

export type ChartPeriod = '7' | '14' | '30' | '90' | 'all';

export function getPriceChartPeriods(): { value: ChartPeriod; label: string }[] {
	return [
		{ value: '7', label: t('chart_period_7') },
		{ value: '14', label: t('chart_period_14') },
		{ value: '30', label: t('chart_period_30') },
		{ value: '90', label: t('chart_period_90') },
		{ value: 'all', label: t('chart_period_all') }
	];
}

/** 고정 패딩 (px) — 텍스트 크기에 맞춘 값 */
export const CHART_PADDING = { PL: 50, PR: 12, PT: 18, PB: 28 } as const;

/** 높이 비율 — VH = VW * ASPECT */
export const CHART_ASPECT = 0.55;

export function buildSmoothPath(pts: { x: number; y: number }[]): string {
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

export function fmtPriceChart(n: number, currency?: string): string {
	return formatPrice(n, currency);
}

export function fmtPriceChartShort(n: number, currency?: string): string {
	return formatPriceShort(n, currency);
}

export function priceChartChangeColor(v: number): string {
	return v < 0 ? '#3b82f6' : v > 0 ? '#ef4444' : '#6b6b65';
}

/**
 * PriceChart 전용 rune 모델. 컴포넌트 최상단에서 한 번만 호출하고,
 * `getData`는 최신 `data` prop을 읽는 함수로 넘긴다.
 */
export function createPriceChartModel(
	getData: () => ChartEntry[],
	getCurrency?: () => string | undefined,
	getWidth?: () => number
) {
	const { PL, PR, PT, PB } = CHART_PADDING;

	const VW = $derived(getWidth?.() || 400);
	const VH = $derived(Math.round(VW * CHART_ASPECT));
	const cW = $derived(VW - PL - PR);
	const cH = $derived(VH - PT - PB);

	let selectedPeriod = $state<ChartPeriod>('14');
	let hoverIdx = $state<number | null>(null);

	const chartData = $derived.by(() => {
		const data = getData();
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

	/** 공유 Y축 범위 계산 */
	const yScale = $derived.by(() => {
		if (chartData.length === 0) return null;
		const prices = chartData.map((d) => d.price);
		const lo = Math.min(...prices);
		const hi = Math.max(...prices);
		const range = hi - lo || lo * 0.1 || 1;
		const yMin = lo - range * 0.15;
		const yMax = hi + range * 0.15;
		const yRange = yMax - yMin;
		return { yMin, yMax, yRange };
	});

	const svgPoints = $derived.by(() => {
		if (!yScale) return [];
		const { yMin, yRange } = yScale;
		const n = chartData.length;
		return chartData.map((d, i) => ({
			x: n === 1 ? PL + cW / 2 : PL + (i / (n - 1)) * cW,
			y: PT + (1 - (d.price - yMin) / yRange) * cH,
			price: d.price,
			date: d.date
		}));
	});

	const yGrid = $derived.by(() => {
		if (!yScale) return [];
		const { yMin, yRange } = yScale;
		return [0, 0.25, 0.5, 0.75, 1].map((t) => ({
			y: PT + (1 - t) * cH,
			price: Math.round(yMin + yRange * t)
		}));
	});

	const xLabels = $derived.by(() => {
		const pts = svgPoints;
		if (pts.length === 0) return [];
		if (pts.length === 1) {
			return [{ x: pts[0].x, label: chartData[0].date.replace('월 ', '/').replace('일', '') }];
		}
		const maxL = Math.min(6, pts.length);
		const step = (pts.length - 1) / (maxL - 1);
		const seen: number[] = [];
		return Array.from({ length: maxL }, (_, i) => {
			const idx = Math.round(i * step);
			if (seen.includes(idx)) return null;
			seen.push(idx);
			return {
				x: pts[idx].x,
				label: chartData[idx].date.replace('월 ', '/').replace('일', '')
			};
		}).filter(Boolean) as { x: number; label: string }[];
	});

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

	const linePath = $derived(buildSmoothPath(svgPoints));
	const fillPath = $derived(
		svgPoints.length >= 2
			? `${linePath} L${svgPoints[svgPoints.length - 1].x},${PT + cH} L${svgPoints[0].x},${PT + cH} Z`
			: ''
	);

	const hoverPt = $derived(hoverIdx !== null ? svgPoints[hoverIdx] : null);

	const tooltipX = $derived(
		hoverPt ? (hoverPt.x + 118 > VW ? hoverPt.x - 120 : hoverPt.x + 10) : 0
	);
	const tooltipY = $derived(hoverPt ? Math.max(PT, hoverPt.y - 36) : 0);

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

	function clearHover() {
		hoverIdx = null;
	}

	return {
		get VW() { return VW; },
		get VH() { return VH; },
		PL,
		PR,
		PT,
		PB,
		get cW() { return cW; },
		get cH() { return cH; },
		periods: getPriceChartPeriods(),
		get selectedPeriod() {
			return selectedPeriod;
		},
		set selectedPeriod(v: ChartPeriod) {
			selectedPeriod = v;
		},
		get chartData() {
			return chartData;
		},
		get stats() {
			return stats;
		},
		get svgPoints() {
			return svgPoints;
		},
		get yGrid() {
			return yGrid;
		},
		get xLabels() {
			return xLabels;
		},
		get minIdx() {
			return minIdx;
		},
		get maxIdx() {
			return maxIdx;
		},
		get linePath() {
			return linePath;
		},
		get fillPath() {
			return fillPath;
		},
		get hoverIdx() {
			return hoverIdx;
		},
		set hoverIdx(v: number | null) {
			hoverIdx = v;
		},
		get hoverPt() {
			return hoverPt;
		},
		get tooltipX() {
			return tooltipX;
		},
		get tooltipY() {
			return tooltipY;
		},
		onMouseMove,
		clearHover,
		fmt: (n: number) => fmtPriceChart(n, getCurrency?.()),
		fmtShort: (n: number) => fmtPriceChartShort(n, getCurrency?.()),
		changeColor: priceChartChangeColor
	};
}
