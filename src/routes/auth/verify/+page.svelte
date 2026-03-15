<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	const email = $derived(page.url.searchParams.get('email') ?? '');

	let code = $state(['', '', '', '', '', '']);
	let inputs: HTMLInputElement[] = [];
	let loading = $state(false);
	let resending = $state(false);

	const fullCode = $derived(code.join(''));
	const isComplete = $derived(fullCode.length === 6);

	function handleInput(index: number, e: Event) {
		const target = e.target as HTMLInputElement;
		const val = target.value.replace(/\D/g, '').slice(-1);
		code[index] = val;
		if (val && index < 5) inputs[index + 1]?.focus();
	}

	function handleKeydown(index: number, e: KeyboardEvent) {
		if (e.key === 'Backspace' && !code[index] && index > 0) inputs[index - 1]?.focus();
	}

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		const pasted = e.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) ?? '';
		pasted.split('').forEach((char, i) => { if (i < 6) code[i] = char; });
		inputs[Math.min(pasted.length, 5)]?.focus();
	}

	$effect(() => {
		if (form?.error) {
			code = ['', '', '', '', '', ''];
			inputs[0]?.focus();
		}
	});
</script>

<div class="rounded-2xl bg-white p-7 shadow-sm" style="border: 1px solid rgba(45, 45, 42, 0.08);">
	<div class="mb-6 text-center">
		<div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl" style="background-color: #e8f2f0;">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-7" style="color: #5aad9c;" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
			</svg>
		</div>
		<h1 class="text-xl font-semibold" style="color: #1a1a17; letter-spacing: -0.01em;">Check your email</h1>
		<p class="mt-1.5 text-sm" style="color: #6b6b65;">
			We sent a 6-digit code to<br />
			<span class="font-medium" style="color: #1a1a17;">{email || 'your email'}</span>
		</p>
	</div>

	<form
		method="POST"
		action="?/verify"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				await update();
			};
		}}
		class="flex flex-col gap-5"
	>
		<input type="hidden" name="token" value={fullCode} />
		<input type="hidden" name="email" value={email} />

		<div>
			<div class="flex justify-center gap-2.5" onpaste={handlePaste}>
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
						class="h-12 w-10 rounded-xl text-center text-lg font-semibold outline-none transition-all disabled:opacity-50"
						style="border: 1px solid rgba(45, 45, 42, 0.1); background-color: #f7f6f3; color: #1a1a17;"
						disabled={loading}
					/>
				{/each}
			</div>
			{#if form?.error}
				<p class="mt-2 text-center text-xs" style="color: #d4183d;">{form.error}</p>
			{/if}
		</div>

		<button
			type="submit"
			disabled={!isComplete || loading}
			class="h-11 w-full rounded-xl px-4 text-sm font-medium transition-all hover:shadow-md focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			style="background-color: #2d2d2a; color: #ffffff;"
		>
			{loading ? 'Verifying...' : 'Verify email'}
		</button>
	</form>

	<div class="mt-5 flex flex-col items-center gap-2 text-sm" style="color: #6b6b65;">
		<div class="flex items-center gap-1">
			<span>{"Didn't receive it?"}</span>
			<form method="POST" action="?/resend" use:enhance={() => {
				resending = true;
				return async ({ update }) => {
					resending = false;
					await update();
				};
			}}>
				<input type="hidden" name="email" value={email} />
				<button
					type="submit"
					disabled={resending}
					class="font-medium underline-offset-2 hover:underline disabled:opacity-50"
					style="color: #1a1a17;"
				>
					{resending ? 'Sending...' : form?.resent ? 'Sent!' : 'Resend code'}
				</button>
			</form>
		</div>
		<a href="/auth/login" class="transition hover:opacity-70" style="color: #6b6b65;">
			Back to login
		</a>
	</div>
</div>
