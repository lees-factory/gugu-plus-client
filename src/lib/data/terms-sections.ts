import { getLocale } from '$lib/paraglide/runtime.js';

export interface LegalSection {
	title: string;
	body: string;
}

const ko: LegalSection[] = [
	{
		title: '제1조 (서비스 목적)',
		body: 'Price Eye(이하 "서비스")는 온라인 쇼핑 플랫폼의 상품 가격을 매일 수집하여 가격 변동 히스토리를 제공하는 개인용 가격 추적 도구입니다. 본 서비스는 실시간 알림 서비스가 아니며, 수집된 가격은 참고용 정보입니다.'
	},
	{
		title: '제2조 (회원 가입 및 계정)',
		body: '회원 가입은 다음 방법 중 하나로 이루어집니다.\n\n• 이메일/비밀번호 가입 (6자리 이메일 인증 코드 확인 필요)\n• Google 계정을 통한 소셜 로그인\n\n회원은 자신의 계정 정보를 안전하게 관리할 책임이 있으며, 타인에게 계정을 공유해서는 안 됩니다. 부정 이용이 확인될 경우 사전 통지 없이 계정이 정지될 수 있습니다.'
	},
	{
		title: '제3조 (서비스 이용)',
		body: '서비스는 현재 무료로 제공됩니다. 회원은 상품을 등록하여 가격 변동 히스토리를 조회하고, 이메일 알림을 받을 수 있습니다. 서비스의 이용 조건은 운영 상황에 따라 변경될 수 있으며, 변경 시 사전에 안내합니다.'
	},
	{
		title: '제4조 (가격 데이터 정책)',
		body: '수집된 가격 데이터는 회원 개인의 자산으로 취급됩니다.\n\n• 상품별로 색상·사이즈 등 SKU를 선택하여 해당 옵션의 가격 히스토리를 별도로 조회할 수 있습니다.\n• 계정 삭제 요청 시 데이터는 30일간 보관 후 완전 삭제됩니다.'
	},
	{
		title: '제5조 (이메일 알림)',
		body: '회원은 추적 중인 상품에 대해 가격 변동 이메일 알림을 설정하거나 해제할 수 있습니다. 알림은 매일 가격 수집 이후 변동이 감지된 경우에 발송되며, 실시간 알림이 아닙니다.'
	},
	{
		title: '제6조 (서비스 이용 제한)',
		body: '다음 행위는 금지되며, 위반 시 서비스 이용이 제한될 수 있습니다.\n\n• 자동화된 방식(봇, 스크립트 등)으로 서비스를 과도하게 이용하는 행위\n• 서비스의 정상적인 운영을 방해하는 행위'
	},
	{
		title: '제7조 (책임의 한계)',
		body: 'Price Eye는 수집된 가격 데이터의 완전한 정확성을 보장하지 않습니다. 쇼핑 플랫폼의 정책 변경, 서버 장애, 또는 불가항력적 사유로 인한 데이터 누락이나 오류에 대해 책임을 지지 않습니다. 서비스를 통해 제공되는 정보를 구매 결정의 유일한 근거로 사용하는 것은 권장하지 않습니다.'
	},
	{
		title: '제8조 (약관 변경)',
		body: '운영자는 관련 법령 또는 서비스 정책에 따라 본 약관을 변경할 수 있습니다. 약관이 변경될 경우 시행일 7일 전에 이메일 또는 서비스 내 공지를 통해 안내합니다. 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.'
	},
	{
		title: '제9조 (분쟁 해결)',
		body: '본 약관과 관련한 분쟁은 대한민국 법령을 적용하며, 소송이 필요한 경우 운영자의 소재지를 관할하는 법원을 1심 법원으로 합니다. 분쟁 발생 시 먼저 priceeye.support@gmail.com으로 연락하여 협의를 통한 해결을 시도합니다.'
	}
];

const en: LegalSection[] = [
	{
		title: 'Article 1 (Purpose of Service)',
		body: 'Price Eye (the "Service") is a personal price tracking tool that collects product prices from online shopping platforms daily and provides price change history. This Service is not a real-time notification service, and collected prices are for reference only.'
	},
	{
		title: 'Article 2 (Registration and Accounts)',
		body: 'Registration can be done through one of the following methods:\n\n• Email/password registration (6-digit email verification code required)\n• Social login via Google account\n\nMembers are responsible for securely managing their account information and must not share their accounts with others. Accounts may be suspended without prior notice if fraudulent use is detected.'
	},
	{
		title: 'Article 3 (Service Usage)',
		body: 'The Service is currently provided free of charge. Members can register products to view price change history and receive email alerts. Service terms may change depending on operational circumstances, and any changes will be communicated in advance.'
	},
	{
		title: 'Article 4 (Price Data Policy)',
		body: 'Collected price data is treated as the personal asset of each member.\n\n• You can select SKU options (color, size, etc.) per product to view separate price histories for each option.\n• Upon account deletion request, data is retained for 30 days before permanent deletion.'
	},
	{
		title: 'Article 5 (Email Alerts)',
		body: 'Members can enable or disable price change email alerts for tracked products. Alerts are sent after daily price collection when changes are detected, and are not real-time notifications.'
	},
	{
		title: 'Article 6 (Service Usage Restrictions)',
		body: 'The following actions are prohibited and may result in restricted service access:\n\n• Excessive use of the Service through automated means (bots, scripts, etc.)\n• Actions that interfere with normal Service operation'
	},
	{
		title: 'Article 7 (Limitation of Liability)',
		body: 'Price Eye does not guarantee complete accuracy of collected price data. We are not responsible for data omissions or errors due to shopping platform policy changes, server failures, or force majeure. Using information provided through the Service as the sole basis for purchase decisions is not recommended.'
	},
	{
		title: 'Article 8 (Changes to Terms)',
		body: 'The operator may modify these Terms in accordance with applicable laws or service policies. Changes will be communicated via email or in-service notice at least 7 days before the effective date. If you do not agree with the modified Terms, you may discontinue use and withdraw.'
	},
	{
		title: 'Article 9 (Dispute Resolution)',
		body: "Disputes related to these Terms are governed by the laws of the Republic of Korea. If litigation is necessary, the court with jurisdiction over the operator's location shall serve as the court of first instance. In the event of a dispute, please first contact priceeye.support@gmail.com to attempt resolution through consultation."
	}
];

export function getTermsSections(): LegalSection[] {
	return getLocale() === 'ko' ? ko : en;
}

/** @deprecated Use getTermsSections() instead */
export const termsSections = ko;
