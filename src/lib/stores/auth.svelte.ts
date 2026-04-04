import { browser } from '$app/environment';

type User = { email: string; id?: string };
type PlanType = 'free' | 'pro';
type Plan = { type: PlanType; maxItems: number };

interface AuthStore {
	readonly user: User | null;
	readonly plan: Plan;
	initialize(email: string, userId?: string | null): void;
	logout(): void;
}

function createAuthStore(): AuthStore {
	let user = $state<User | null>(null);
	let plan = $state<Plan>({ type: 'free', maxItems: 5 });

	return {
		get user() {
			return user;
		},
		get plan() {
			return plan;
		},
		initialize(email: string, userId?: string | null) {
			user = userId ? { email, id: userId } : { email };
		},
		logout() {
			user = null;
			plan = { type: 'free', maxItems: 5 };
		}
	};
}

const SSR_STUB: AuthStore = {
	user: null,
	plan: { type: 'free', maxItems: 5 },
	initialize() {},
	logout() {}
};

/**
 * 브라우저에서만 $state 기반 싱글턴 생성.
 * SSR에서는 $state가 없는 정적 스텁을 반환하여 요청 간 상태 오염 방지.
 */
export const auth: AuthStore = browser ? createAuthStore() : SSR_STUB;
