<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	const email = $derived(page.url.searchParams.get('email') ?? '');

	let code = $state(['', '', '', '', '', '']);
	let inputs: HTMLInputElement[] = [];
	let loading = $state(false);
	let resending = $state(false);
	let resent = $state(false);
	let error = $state('');

	const fullCode = $derived(code.join(''));
	const isComplete = $derived(fullCode.length === 6);

	function handleInput(index: number, e: Event) {
		const target = e.target as HTMLInputElement;
		const val = target.value.replace(/\D/g, '').slice(-1);
		code[index] = val;

		if (val && index < 5) {
			inputs[index + 1]?.focus();
		}
	}

	function handleKeydown(index: number, e: KeyboardEvent) {
		if (e.key === 'Backspace' && !code[index] && index > 0) {
			inputs[index - 1]?.focus();
		}
	}

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		const pasted = e.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) ?? '';
		pasted.split('').forEach((char, i) => {
			if (i < 6) code[i] = char;
		});
		const nextEmpty = pasted.length < 6 ? pasted.length : 5;
		inputs[nextEmpty]?.focus();
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!isComplete) return;
		error = '';
		loading = true;
		// TODO: 실제 인증 코드 검증 API 연동
		await new Promise((r) => setTimeout(r, 800));
		loading = false;
		// 테스트용: 코드가 '123456'이면 성공
		if (fullCode === '123456') {
			goto('/');
		} else {
			error = 'Invalid code. Please try again.';
			code = ['', '', '', '', '', ''];
			inputs[0]?.focus();
		}
	}

	async function handleResend() {
		resending = true;
		resent = false;
		// TODO: 실제 코드 재발송 API 연동
		await new Promise((r) => setTimeout(r, 800));
		resending = false;
		resent = true;
		setTimeout(() => (resent = false), 3000);
	}
</script>

<div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
	<div class="mb-6 text-center">
		<div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-zinc-100">
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
		<h1 class="text-xl font-semibold tracking-tight text-zinc-900">Check your email</h1>
		<p class="mt-1.5 text-sm text-zinc-500">
			We sent a 6-digit code to<br />
			<span class="font-medium text-zinc-700">{email || 'your email'}</span>
		</p>
	</div>

	<form onsubmit={handleSubmit} class="flex flex-col gap-5">
		<div>
			<div class="flex justify-center gap-2" onpaste={handlePaste}>
				{#each code as _, i}
					<input
						bind:this={inputs[i]}
						type="text"
						inputmode="numeric"
						maxlength="1"
						value={code[i]}
						oninput={(e) => handleInput(i, e)}
						onkeydown={(e) => handleKeydown(i, e)}
						aria-label={`Digit ${i + 1}`}
						class="h-12 w-10 rounded-md border border-zinc-200 bg-white text-center text-lg font-semibold text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 disabled:opacity-50"
						disabled={loading}
					/>
				{/each}
			</div>
			{#if error}
				<p class="mt-2 text-center text-xs text-red-500">{error}</p>
			{/if}
		</div>

		<button
			type="submit"
			disabled={!isComplete || loading}
			class="h-9 w-full rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{loading ? 'Verifying...' : 'Verify email'}
		</button>
	</form>

	<div class="mt-5 flex flex-col items-center gap-2 text-sm text-zinc-500">
		<p>
			{"Didn't receive it? "}
			<button
				type="button"
				onclick={handleResend}
				disabled={resending}
				class="font-medium text-zinc-900 underline-offset-2 hover:underline disabled:opacity-50"
			>
				{resending ? 'Sending...' : resent ? 'Sent!' : 'Resend code'}
			</button>
		</p>
		<a href="/auth/login" class="text-zinc-400 transition hover:text-zinc-700">
			Back to login
		</a>
	</div>
</div>
