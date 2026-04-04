<script lang="ts">
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
</script>

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
		role="presentation"
		onclick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
		onkeydown={(e) => { if (e.key === 'Escape') onCancel(); }}
	>
		<!-- Dialog -->
		<div
			class="w-full max-w-sm rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-xl"
			role="alertdialog"
			aria-modal="true"
			aria-describedby="confirm-message"
		>
			<p id="confirm-message" class="text-sm text-zinc-700 leading-relaxed">
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
