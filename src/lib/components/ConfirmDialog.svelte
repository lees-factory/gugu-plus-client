<script lang="ts">
	import { tick } from 'svelte';
	import { t } from '$lib/i18n/t';

	let {
		open,
		message,
		confirmLabel,
		onConfirm,
		onCancel
	}: {
		open: boolean;
		message: string;
		confirmLabel?: string;
		onConfirm: () => void;
		onCancel: () => void;
	} = $props();

	let dialogEl: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (open) {
			void tick().then(() => {
				const first = dialogEl?.querySelector<HTMLElement>('button');
				first?.focus();
			});
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onCancel();
		if (e.key === 'Tab' && dialogEl) {
			const focusable = dialogEl.querySelectorAll<HTMLElement>(
				'button, a[href], [tabindex]:not([tabindex="-1"])'
			);
			if (focusable.length === 0) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	}
</script>

<svelte:window
	onkeydown={(e) => {
		if (open) handleKeydown(e);
	}}
/>

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
		role="presentation"
		onclick={(e) => {
			if (e.target === e.currentTarget) onCancel();
		}}
	>
		<!-- Dialog -->
		<div
			bind:this={dialogEl}
			class="w-full max-w-sm rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-xl"
			role="alertdialog"
			aria-modal="true"
			aria-describedby="confirm-message"
		>
			<p id="confirm-message" class="text-sm leading-relaxed text-zinc-700">
				{message}
			</p>
			<div class="mt-5 flex justify-end gap-2.5">
				<button
					type="button"
					onclick={onCancel}
					class="rounded-xl border border-zinc-200/60 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
				>
					{t('modal_cancel')}
				</button>
				<button
					type="button"
					onclick={onConfirm}
					class="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
				>
					{confirmLabel ?? t('item_delete')}
				</button>
			</div>
		</div>
	</div>
{/if}
