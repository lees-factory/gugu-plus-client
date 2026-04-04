/** ISO 4217 코드 → narrowSymbol 포맷 (CN¥→¥, US$→$) + 3자리 쉼표 */
export function formatPrice(n: number, currency?: string | null): string {
	if (!Number.isFinite(n)) return '-';
	const code = currency && currency.length === 3 ? currency.toUpperCase() : 'KRW';
	try {
		return new Intl.NumberFormat('ko-KR', {
			style: 'currency',
			currency: code,
			currencyDisplay: 'narrowSymbol',
			maximumFractionDigits: 0
		}).format(n);
	} catch {
		return `${n.toLocaleString('ko-KR')} ${code}`;
	}
}

/** 차트 Y축용 축약 포맷 (KRW 만 단위, 그 외는 일반 포맷) */
export function formatPriceShort(n: number, currency?: string | null): string {
	if (!Number.isFinite(n)) return '-';
	const code = currency && currency.length === 3 ? currency.toUpperCase() : 'KRW';
	if (code === 'KRW' && Math.abs(n) >= 10000) {
		const sign = n < 0 ? '-' : '';
		const v = Math.abs(n) / 10000;
		return `${sign}${v % 1 === 0 ? v : v.toFixed(1)}만`;
	}
	return formatPrice(n, currency);
}
