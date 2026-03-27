/** Map API `market` enum values to human-friendly site display names. */
export function marketToSite(market: string): string {
	const map: Record<string, string> = {
		ALIEXPRESS: 'AliExpress',
		AMAZON: 'Amazon',
		COUPANG: 'Coupang',
		EBAY: 'eBay',
		TAOBAO: 'Taobao'
	};
	return map[market] ?? market;
}
