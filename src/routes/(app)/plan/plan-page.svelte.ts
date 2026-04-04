import { t } from '$lib/i18n/t';

export type FaqItem = { q: string; a: string };

export function createPlanPage() {
	const faqItems = $derived<FaqItem[]>([
		{ q: t('plan_faq_1_q'), a: t('plan_faq_1_a') },
		{ q: t('plan_faq_2_q'), a: t('plan_faq_2_a') }
	]);

	return {
		get faqItems() {
			return faqItems;
		}
	};
}
