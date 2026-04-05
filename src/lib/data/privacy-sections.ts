import { getLocale } from '$lib/paraglide/runtime.js';
import { t } from '$lib/i18n/t';
import type { LegalSection } from './terms-sections';

export interface PrivacySummaryItem {
	icon: string;
	label: string;
	desc: string;
}

export function getPrivacySummaryItems(): PrivacySummaryItem[] {
	return [
		{
			icon: 'collect',
			label: t('privacy_summary_collect_label'),
			desc: t('privacy_summary_collect_desc')
		},
		{
			icon: 'no-sell',
			label: t('privacy_summary_nosell_label'),
			desc: t('privacy_summary_nosell_desc')
		},
		{
			icon: 'delete',
			label: t('privacy_summary_delete_label'),
			desc: t('privacy_summary_delete_desc')
		}
	];
}

const ko: LegalSection[] = [
	{
		title: '제1조 (수집하는 개인정보)',
		body: '서비스 이용 과정에서 다음과 같은 정보가 수집됩니다.\n\n• 필수: 이메일 주소 (회원 식별 및 알림 발송)\n• 선택: 표시 이름 (서비스 내 표시용)\n• 자동 수집: 접속 IP, 브라우저 유형 (서비스 품질 개선 목적)\n\nGoogle 소셜 로그인 이용 시 Google 계정의 이메일 주소와 프로필 정보가 Firebase를 통해 전달됩니다. 이메일/비밀번호 가입 시 비밀번호는 단방향 암호화(bcrypt)로 저장되며, 운영자도 복호화할 수 없습니다.'
	},
	{
		title: '제2조 (개인정보 이용 목적)',
		body: '수집된 개인정보는 다음 목적으로만 사용됩니다.\n\n• 회원 가입, 이메일 인증 및 본인 확인\n• 가격 변동 이메일 알림 발송\n• 고객 문의 응대\n• 서비스 개선을 위한 이용 현황 분석 (익명화 처리)'
	},
	{
		title: '제3조 (쿠키 및 로컬 저장소)',
		body: '서비스는 다음과 같은 쿠키 및 브라우저 저장소를 사용합니다.\n\n[쿠키 — httpOnly, SameSite=Lax]\n• access_token: 인증 토큰 (7일)\n• refresh_token: 토큰 갱신용 (7일)\n• session: 로그인 이메일 (7일)\n• user_id: 사용자 식별자 (7일)\n\n[로컬 저장소 — 브라우저 내 저장]\n• 통화·언어 설정 (사용자 환경설정)\n\n쿠키에는 개인을 직접 식별할 수 있는 정보(이름, 주민번호 등)는 포함되지 않습니다. 브라우저 설정에서 쿠키를 거부할 수 있으나, 이 경우 로그인이 유지되지 않습니다.'
	},
	{
		title: '제4조 (개인정보 보유 및 파기)',
		body: '회원 탈퇴 요청 시 개인정보는 30일간 임시 보관 후 완전 삭제됩니다. 단, 관련 법령에 의해 보존이 필요한 경우 해당 기간까지 보관합니다.\n\n• 계약·청약 철회 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)\n• 접속 기록: 3개월 (통신비밀보호법)'
	},
	{
		title: '제5조 (개인정보 제3자 제공)',
		body: '서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 다음의 경우는 예외로 합니다.\n\n• 이용자가 사전에 동의한 경우\n• 법령의 규정에 의거하거나 수사 목적으로 관계 기관이 요구하는 경우\n\n현재 서비스는 Google 소셜 로그인을 위해 Firebase(Google LLC)를 이용하고 있습니다.'
	},
	{
		title: '제6조 (이용자 권리)',
		body: '이용자는 언제든지 다음 권리를 행사할 수 있습니다.\n\n• 비밀번호 변경: 서비스 내 설정 메뉴에서 직접 변경\n• 계정 탈퇴 및 데이터 삭제: 설정 > 계정 탈퇴 또는 이메일 요청\n• 알림 수신 거부: 상품별 알림 설정에서 직접 해제\n\n권리 행사 요청은 priceeye.support@gmail.com으로 문의하시면 7영업일 이내 처리됩니다.'
	},
	{
		title: '제7조 (개인정보 보호 조치)',
		body: '서비스는 개인정보 보호를 위해 다음과 같은 기술적 조치를 시행합니다.\n\n• 모든 통신 구간 SSL/TLS 암호화\n• 비밀번호 bcrypt 단방향 암호화 저장\n• 인증 토큰 자동 갱신 및 만료 관리\n• httpOnly·SameSite 쿠키를 통한 토큰 보호'
	},
	{
		title: '제8조 (개인정보 보호책임자)',
		body: '개인정보 관련 문의는 아래로 연락해 주시기 바랍니다.\n\n이메일: priceeye.support@gmail.com\n응답 시간: 영업일 기준 2일 이내'
	}
];

const en: LegalSection[] = [
	{
		title: 'Article 1 (Personal Information Collected)',
		body: 'The following information is collected during use of the Service:\n\n• Required: Email address (for member identification and alert delivery)\n• Optional: Display name (for in-service display)\n• Automatically collected: IP address, browser type (for service quality improvement)\n\nWhen using Google social login, your Google account email address and profile information are transmitted through Firebase. For email/password registration, passwords are stored with one-way encryption (bcrypt) and cannot be decrypted even by the operator.'
	},
	{
		title: 'Article 2 (Purpose of Personal Information Use)',
		body: 'Collected personal information is used only for the following purposes:\n\n• Member registration, email verification, and identity confirmation\n• Price change email alert delivery\n• Customer inquiry support\n• Usage analysis for service improvement (anonymized)'
	},
	{
		title: 'Article 3 (Cookies and Local Storage)',
		body: 'The Service uses the following cookies and browser storage:\n\n[Cookies — httpOnly, SameSite=Lax]\n• access_token: Authentication token (7 days)\n• refresh_token: Token renewal (7 days)\n• session: Login email (7 days)\n• user_id: User identifier (7 days)\n\n[Local Storage — Browser]\n• Currency and language settings (user preferences)\n\nCookies do not contain directly identifiable personal information (name, ID number, etc.). You may refuse cookies in your browser settings, but login sessions will not be maintained.'
	},
	{
		title: 'Article 4 (Retention and Destruction of Personal Information)',
		body: 'Upon account deletion request, personal information is temporarily retained for 30 days before permanent deletion. However, if retention is required by applicable laws, data is kept for the required period:\n\n• Contract/withdrawal records: 5 years (Act on Consumer Protection in Electronic Commerce)\n• Access logs: 3 months (Protection of Communications Secrets Act)'
	},
	{
		title: 'Article 5 (Third-Party Disclosure)',
		body: "In principle, the Service does not provide users' personal information to third parties. However, the following cases are exceptions:\n\n• When the user has given prior consent\n• When required by law or requested by investigative authorities\n\nThe Service currently uses Firebase (Google LLC) for Google social login."
	},
	{
		title: 'Article 6 (User Rights)',
		body: 'Users may exercise the following rights at any time:\n\n• Password change: Directly change in Settings menu\n• Account deletion and data removal: Settings > Delete Account or email request\n• Opt-out of alerts: Disable directly in per-product alert settings\n\nRights requests will be processed within 7 business days. Contact priceeye.support@gmail.com.'
	},
	{
		title: 'Article 7 (Personal Information Protection Measures)',
		body: 'The Service implements the following technical measures for personal information protection:\n\n• SSL/TLS encryption for all communication\n• One-way bcrypt encryption for password storage\n• Automatic authentication token renewal and expiration management\n• Token protection through httpOnly and SameSite cookies'
	},
	{
		title: 'Article 8 (Privacy Officer)',
		body: 'For personal information inquiries, please contact:\n\nEmail: priceeye.support@gmail.com\nResponse time: Within 2 business days'
	}
];

export function getPrivacySections(): LegalSection[] {
	return getLocale() === 'ko' ? ko : en;
}

/** @deprecated Use getPrivacySections() instead */
export const privacySections = ko;
