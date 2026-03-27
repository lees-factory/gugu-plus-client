import { auth } from '$lib/stores/auth.svelte';

export type BillingCycle = 'monthly' | 'yearly';

export type PlanFeatureRow = { text: string; included: boolean };

export type ComparisonRow = { label: string; free: string; pro: string };

export type FaqItem = { q: string; a: string };

export type TrustSignalIcon = 'shield' | 'refresh' | 'data';

export type TrustSignal = { icon: TrustSignalIcon; text: string };

export const MONTHLY_PRICE = 6900;
export const YEARLY_PRICE = 59000;

export const yearlyPerMonth = Math.round(YEARLY_PRICE / 12);
export const yearlySavings = MONTHLY_PRICE * 12 - YEARLY_PRICE;

export const freeFeatures: PlanFeatureRow[] = [
	{ text: '최대 5개 상품 추적', included: true },
	{ text: '매일 1회 가격 업데이트 (24h)', included: true },
	{ text: '최근 14일 가격 히스토리', included: true },
	{ text: '기본 가격 그래프', included: true },
	{ text: '이메일 알림', included: true },
	{ text: '무제한 가격 히스토리', included: false },
	{ text: '고급 통계 (최저·최고·평균가)', included: false },
	{ text: 'CSV 내보내기', included: false }
];

export const proFeatures: PlanFeatureRow[] = [
	{ text: '최대 50개 상품 추적', included: true },
	{ text: '매일 1회 가격 업데이트 (24h)', included: true },
	{ text: '무제한 가격 히스토리', included: true },
	{ text: '고급 통계 (최저·최고·평균가·변동률)', included: true },
	{ text: '기간별 그래프 비교 (7d / 30d / 90d)', included: true },
	{ text: '이메일 알림', included: true },
	{ text: 'CSV 내보내기', included: true }
];

export const comparisonRows: ComparisonRow[] = [
	{ label: '상품 추적', free: '5개', pro: '50개' },
	{ label: '업데이트 주기', free: '매일 (24h)', pro: '매일 (24h)' },
	{ label: '가격 히스토리', free: '14일', pro: '무제한' },
	{ label: '고급 통계', free: '—', pro: '최저·최고·평균가·변동률' },
	{ label: '기간별 비교', free: '—', pro: '7d / 30d / 90d' },
	{ label: 'CSV 내보내기', free: '—', pro: '✓' },
	{ label: '이메일 알림', free: '✓', pro: '✓' }
];

export const faqItems: FaqItem[] = [
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
		a: 'Price Eye는 매일 1회 가격을 수집합니다. 빠른 알림보다 정확한 장기 히스토리 데이터 제공을 목표로 합니다.'
	},
	{
		q: '결제 수단은 무엇이 지원되나요?',
		a: '신용카드, 체크카드, 카카오페이, 네이버페이를 지원합니다. 안전한 결제를 위해 SSL 암호화를 사용합니다.'
	}
];

export const trustSignals: TrustSignal[] = [
	{ icon: 'shield', text: 'SSL 보안 결제' },
	{ icon: 'refresh', text: '언제든 취소 가능' },
	{ icon: 'data', text: '데이터 절대 삭제 없음' }
];

export function createPlanPage() {
	const model = $state({
		billingCycle: 'monthly' as BillingCycle,
		loading: false
	});

	const currentPlan = $derived(auth.plan.type);

	const monthlyToggleStyle = $derived(
		`background-color: ${model.billingCycle === 'monthly' ? '#ffffff' : 'transparent'}; color: ${model.billingCycle === 'monthly' ? '#1a1a17' : '#6b6b65'}; box-shadow: ${model.billingCycle === 'monthly' ? '0 1px 4px rgba(45,45,42,0.08)' : 'none'};`
	);

	const yearlyToggleStyle = $derived(
		`background-color: ${model.billingCycle === 'yearly' ? '#ffffff' : 'transparent'}; color: ${model.billingCycle === 'yearly' ? '#1a1a17' : '#6b6b65'}; box-shadow: ${model.billingCycle === 'yearly' ? '0 1px 4px rgba(45,45,42,0.08)' : 'none'};`
	);

	const upgradeButtonLabel = $derived(
		model.loading
			? '처리 중...'
			: model.billingCycle === 'monthly'
				? 'Pro로 업그레이드'
				: '연간 Pro로 업그레이드'
	);

	function setBillingCycle(cycle: BillingCycle) {
		model.billingCycle = cycle;
	}

	async function handleUpgrade() {
		model.loading = true;
		// TODO: 실제 결제 연동
		await new Promise((r) => setTimeout(r, 1000));
		model.loading = false;
	}

	return {
		model,
		get currentPlan() {
			return currentPlan;
		},
		get monthlyToggleStyle() {
			return monthlyToggleStyle;
		},
		get yearlyToggleStyle() {
			return yearlyToggleStyle;
		},
		get upgradeButtonLabel() {
			return upgradeButtonLabel;
		},
		setBillingCycle,
		handleUpgrade
	};
}
