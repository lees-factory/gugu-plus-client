<script lang="ts">
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let confirm = $state('');
	let showPassword = $state(false);
	let loading = $state(false);

	const passwordMismatch = $derived(password.length > 0 && confirm.length > 0 && password !== confirm);
	const canSubmit = $derived(!!email && !!password && password === confirm && !loading);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!canSubmit) return;
		loading = true;
		// TODO: 실제 회원가입 API 연동
		await new Promise((r) => setTimeout(r, 800));
		loading = false;
		goto(`/auth/verify?email=${encodeURIComponent(email)}`);
	}

	async function handleGoogle() {
		loading = true;
		// TODO: Google OAuth 연동
		await new Promise((r) => setTimeout(r, 600));
		loading = false;
		goto('/'); // Google OAuth는 자체 인증 플로우 사용
	}
</script>

<div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
	<div class="mb-6">
		<h1 class="text-xl font-semibold tracking-tight text-zinc-900">
			Start building your price history
		</h1>
		<p class="mt-1 text-sm text-zinc-500">Track prices across global marketplaces.</p>
	</div>

	<form onsubmit={handleSubmit} class="flex flex-col gap-4">
		<div class="flex flex-col gap-1.5">
			<label for="email" class="text-sm font-medium text-zinc-700">Email</label>
			<input
				id="email"
				type="email"
				bind:value={email}
				placeholder="you@example.com"
				autocomplete="email"
				required
				class="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-50"
			/>
		</div>

		<div class="flex flex-col gap-1.5">
			<label for="password" class="text-sm font-medium text-zinc-700">Password</label>
			<div class="relative">
				<input
					id="password"
					type={showPassword ? 'text' : 'password'}
					bind:value={password}
					placeholder="Create a password"
					autocomplete="new-password"
					required
					class="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 pr-10 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-50"
				/>
				<button
					type="button"
					onclick={() => (showPassword = !showPassword)}
					aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
					class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-zinc-600"
				>
					{#if showPassword}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
						</svg>
					{:else}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
						</svg>
					{/if}
				</button>
			</div>
		</div>

		<div class="flex flex-col gap-1.5">
			<label for="confirm" class="text-sm font-medium text-zinc-700">Confirm Password</label>
			<input
				id="confirm"
				type={showPassword ? 'text' : 'password'}
				bind:value={confirm}
				placeholder="Confirm your password"
				autocomplete="new-password"
				required
				class="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-50"
				aria-invalid={passwordMismatch}
			/>
			{#if passwordMismatch}
				<p class="text-xs text-red-500">Passwords do not match.</p>
			{/if}
		</div>

		<button
			type="submit"
			disabled={!canSubmit}
			class="h-9 w-full rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{loading ? 'Creating account...' : 'Create Free Account'}
		</button>
	</form>

	<div class="my-4 flex items-center gap-3">
		<div class="h-px flex-1 bg-zinc-200"></div>
		<span class="text-xs text-zinc-400">or</span>
		<div class="h-px flex-1 bg-zinc-200"></div>
	</div>

	<button
		type="button"
		onclick={handleGoogle}
		disabled={loading}
		class="flex h-9 w-full items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
	>
		<svg viewBox="0 0 24 24" class="size-4" aria-hidden="true">
			<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
			<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
			<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
			<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
		</svg>
		Continue with Google
	</button>

	<p class="mt-4 text-center text-xs text-zinc-400">
		Free plan includes 5 tracked items and 14 days of history.
	</p>

	<p class="mt-3 text-center text-sm text-zinc-500">
		Already have an account?{' '}
		<a href="/auth/login" class="font-medium text-zinc-900 underline-offset-2 hover:underline">
			Log in
		</a>
	</p>
</div>
