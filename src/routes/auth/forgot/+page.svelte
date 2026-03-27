<script lang="ts">
	import { resolve } from '$app/paths';
	let email = $state('');
	let loading = $state(false);
	let sent = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!email) return;
		loading = true;
		// TODO: 실제 비밀번호 재설정 이메일 발송 API 연동
		await new Promise((r) => setTimeout(r, 800));
		loading = false;
		sent = true;
	}
</script>

<div class="rounded-2xl bg-white p-7 shadow-sm" style="border: 1px solid rgba(45, 45, 42, 0.08);">
	<div class="mb-6">
		<h1 class="text-xl font-semibold" style="color: #1a1a17; letter-spacing: -0.01em;">Reset your password</h1>
		{#if !sent}
			<p class="mt-1 text-sm" style="color: #6b6b65;">Enter your email and we'll send you a reset link.</p>
		{/if}
	</div>

	{#if sent}
		<div class="flex flex-col items-center gap-4 py-2">
			<div
				class="flex size-14 items-center justify-center rounded-2xl"
				style="background-color: #e8f2f0;"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					class="size-7"
					style="color: #5aad9c;"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
				</svg>
			</div>
			<p class="text-center text-sm leading-relaxed" style="color: #6b6b65;">
				Check your email for reset instructions.
			</p>
			<a
				href={resolve('/auth/login')}
				class="flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-medium transition-all hover:shadow-sm focus-visible:outline-none"
				style="border: 1px solid rgba(45, 45, 42, 0.1); background-color: #ffffff; color: #1a1a17;"
			>
				Back to login
			</a>
		</div>
	{:else}
		<form onsubmit={handleSubmit} class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<label for="email" class="text-sm font-medium" style="color: #1a1a17;">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					placeholder="you@example.com"
					autocomplete="email"
					required
					class="h-11 w-full rounded-xl px-4 text-sm outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50"
					style="
						border: 1px solid rgba(45, 45, 42, 0.1);
						background-color: #f7f6f3;
						color: #1a1a17;
					"
				/>
			</div>

			<button
				type="submit"
				disabled={loading || !email}
				class="h-11 w-full rounded-xl px-4 text-sm font-medium transition-all hover:shadow-md focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				style="background-color: #2d2d2a; color: #ffffff;"
			>
				{loading ? 'Sending...' : 'Send reset link'}
			</button>

			<a
				href={resolve('/auth/login')}
				class="text-center text-sm transition hover:opacity-70"
				style="color: #6b6b65;"
			>
				Back to login
			</a>
		</form>
	{/if}
</div>
