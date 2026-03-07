<script lang="ts">
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

<div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
	<div class="mb-6">
		<h1 class="text-xl font-semibold tracking-tight text-zinc-900">Reset your password</h1>
		{#if !sent}
			<p class="mt-1 text-sm text-zinc-500">{"Enter your email and we'll send you a reset link."}</p>
		{/if}
	</div>

	{#if sent}
		<div class="flex flex-col items-center gap-4 py-2">
			<div class="flex size-12 items-center justify-center rounded-full bg-zinc-100">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					class="size-6 text-zinc-700"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
				</svg>
			</div>
			<p class="text-center text-sm leading-relaxed text-zinc-500">
				Check your email for reset instructions.
			</p>
			<a
				href="/auth/login"
				class="flex h-9 w-full items-center justify-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
			>
				Back to login
			</a>
		</div>
	{:else}
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

			<button
				type="submit"
				disabled={loading || !email}
				class="h-9 w-full rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{loading ? 'Sending...' : 'Send reset link'}
			</button>

			<a
				href="/auth/login"
				class="text-center text-sm text-zinc-500 transition hover:text-zinc-900"
			>
				Back to login
			</a>
		</form>
	{/if}
</div>
