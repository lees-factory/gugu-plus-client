import { auth } from '$lib/stores/auth.svelte';
import { t } from '$lib/i18n/t';

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
			? t('plan_upgrading')
			: model.billingCycle === 'monthly'
				? t('plan_upgrade_monthly')
				: t('plan_upgrade_yearly')
	);

	const freeFeatures = $derived<PlanFeatureRow[]>([
		{ text: t('plan_free_feat_1'), included: true },
		{ text: t('plan_free_feat_2'), included: true },
		{ text: t('plan_free_feat_3'), included: true },
		{ text: t('plan_free_feat_4'), included: true },
		{ text: t('plan_free_feat_5'), included: true },
		{ text: t('plan_free_feat_6'), included: false },
		{ text: t('plan_free_feat_7'), included: false },
		{ text: t('plan_free_feat_8'), included: false }
	]);

	const proFeatures = $derived<PlanFeatureRow[]>([
		{ text: t('plan_pro_feat_1'), included: true },
		{ text: t('plan_pro_feat_2'), included: true },
		{ text: t('plan_pro_feat_3'), included: true },
		{ text: t('plan_pro_feat_4'), included: true },
		{ text: t('plan_pro_feat_5'), included: true },
		{ text: t('plan_pro_feat_6'), included: true },
		{ text: t('plan_pro_feat_7'), included: true }
	]);

	const comparisonRows = $derived<ComparisonRow[]>([
		{ label: t('plan_cmp_label_1'), free: t('plan_cmp_free_1'), pro: t('plan_cmp_pro_1') },
		{ label: t('plan_cmp_label_2'), free: t('plan_cmp_free_2'), pro: t('plan_cmp_pro_2') },
		{ label: t('plan_cmp_label_3'), free: t('plan_cmp_free_3'), pro: t('plan_cmp_pro_3') },
		{ label: t('plan_cmp_label_4'), free: t('plan_cmp_free_4'), pro: t('plan_cmp_pro_4') },
		{ label: t('plan_cmp_label_5'), free: t('plan_cmp_free_5'), pro: t('plan_cmp_pro_5') },
		{ label: t('plan_cmp_label_6'), free: t('plan_cmp_free_6'), pro: t('plan_cmp_pro_6') },
		{ label: t('plan_cmp_label_7'), free: t('plan_cmp_free_7'), pro: t('plan_cmp_pro_7') }
	]);

	const faqItems = $derived<FaqItem[]>([
		{ q: t('plan_faq_1_q'), a: t('plan_faq_1_a') },
		{ q: t('plan_faq_2_q'), a: t('plan_faq_2_a') },
		{ q: t('plan_faq_3_q'), a: t('plan_faq_3_a') },
		{ q: t('plan_faq_4_q'), a: t('plan_faq_4_a') }
	]);

	const trustSignals = $derived<TrustSignal[]>([
		{ icon: 'shield', text: t('plan_trust_ssl') },
		{ icon: 'refresh', text: t('plan_trust_cancel') },
		{ icon: 'data', text: t('plan_trust_data') }
	]);

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
		get freeFeatures() {
			return freeFeatures;
		},
		get proFeatures() {
			return proFeatures;
		},
		get comparisonRows() {
			return comparisonRows;
		},
		get faqItems() {
			return faqItems;
		},
		get trustSignals() {
			return trustSignals;
		},
		setBillingCycle,
		handleUpgrade
	};
}
