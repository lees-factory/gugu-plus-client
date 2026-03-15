type User = { email: string }
type PlanType = 'free' | 'pro'
type Plan = { type: PlanType; maxItems: number }

class AuthStore {
	user = $state<User | null>(null)
	plan = $state<Plan>({ type: 'free', maxItems: 5 })

	/** 페이지 로드 시 서버 쿠키에서 복원 */
	initialize(email: string) {
		this.user = { email }
	}

	/** 로그아웃: 클라이언트 상태만 초기화 (쿠키는 /auth/logout 라우트에서 삭제) */
	logout() {
		this.user = null
		this.plan = { type: 'free', maxItems: 5 }
	}
}

export const auth = new AuthStore()
