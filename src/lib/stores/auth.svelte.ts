import { browser } from '$app/environment'

type User = { email: string }
type PlanType = 'free' | 'pro'
type Plan = { type: PlanType; maxItems: number }

const SESSION_COOKIE = 'session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7일

class AuthStore {
	user = $state<User | null>(null)
	plan = $state<Plan>({ type: 'free', maxItems: 5 })

	/** 로그인: 쿠키 설정 + 상태 업데이트 */
	login(email: string) {
		this.user = { email }
		if (browser) {
			document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(email)}; path=/; max-age=${MAX_AGE}; SameSite=Lax`
		}
	}

	/** 페이지 로드 시 서버 데이터로 복원 (쿠키 재설정 없음) */
	initialize(email: string) {
		this.user = { email }
	}

	/** 로그아웃: 쿠키 삭제 + 상태 초기화 */
	logout() {
		this.user = null
		if (browser) {
			document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`
		}
	}
}

export const auth = new AuthStore()
