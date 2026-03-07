<script lang="ts">
	let { onAdd }: { onAdd: () => void } = $props();
</script>

<div class="flex flex-col items-center justify-center py-24 text-center">
	<div class="flex size-16 items-center justify-center rounded-2xl bg-zinc-100">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-8 text-zinc-400" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
		</svg>
	</div>
	<h2 class="mt-4 text-base font-semibold text-zinc-900">아직 추적 중인 상품이 없어요</h2>
	<p class="mt-1.5 max-w-sm text-sm text-zinc-500">
		Amazon, Taobao, eBay 등 지원 사이트의 상품 URL을 추가하면 가격 변동을 자동으로 추적해드려요.
	</p>
	<button
		type="button"
		onclick={onAdd}
		class="mt-6 flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
	>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
		</svg>
		첫 상품 추가하기
	</button>
</div>
