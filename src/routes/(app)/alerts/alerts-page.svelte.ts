// 독립 알림 목록 API가 제거됨. 알림은 상품 상세(/items/[id])에서 관리.
// 이 페이지는 빈 상태로 유지.

type AlertsPageData = {
	alerts: never[];
	trackedItems: never[];
	error: string | null;
};

export function createAlertsPage(getData: () => AlertsPageData) {
	const alerts = $derived(getData().alerts);
	const error = $derived(getData().error);

	return {
		get alerts() {
			return alerts;
		},
		get loading() {
			return false;
		},
		get error() {
			return error;
		},
		get removingId() {
			return '';
		},
		get skuMap() {
			return new Map();
		},
		removeAlert() {}
	};
}
