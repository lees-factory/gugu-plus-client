import type { RequestHandler } from './$types';

/** 운영 도메인 — .env 의 VITE_SITE_URL 로 일원화. */
const BASE_URL =
	(import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '') ??
	'https://priceeye.vercel.app';

/**
 * robots.txt 동적 라우트.
 * 기존 static/robots.txt 를 대체하여 Sitemap 절대 URL을 환경별로 생성한다.
 *
 * Disallow 규칙 유지:
 * - /api/, /auth/: 서버 엔드포인트·인증 플로우
 * - /items, /alerts, /settings: 로그인 후 개인 페이지 (검색 노출 불필요)
 */
export const GET: RequestHandler = () => {
	const body = `User-agent: *
Allow: /

Disallow: /api/
Disallow: /auth/
Disallow: /items
Disallow: /alerts
Disallow: /settings

Sitemap: ${BASE_URL}/sitemap.xml
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
