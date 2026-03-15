<script lang="ts">
	import { getContext } from 'svelte';

	const toggleSidebar = getContext<() => void>('toggleSidebar');

	// ── Mock data ──────────────────────────────────────────────

	const personalizedPicks = [
		{
			id: 'p1',
			name: 'Keychron K2 Wireless Mechanical Keyboard',
			site: 'Amazon',
			price: 89.99,
			currency: '$',
			priceChange7d: -5.0,
			imageUrl:
				'https://images.unsplash.com/photo-1656711081969-9d16ebc2d210?w=400&fit=crop&auto=format'
		},
		{
			id: 'p2',
			name: 'Nike Air Max 270 Running Shoes',
			site: 'eBay',
			price: 129.99,
			currency: '$',
			priceChange7d: 0,
			imageUrl:
				'https://images.unsplash.com/photo-1739132268718-53d64165d29a?w=400&fit=crop&auto=format'
		},
		{
			id: 'p3',
			name: 'Apple AirPods Pro (2nd Generation)',
			site: 'Amazon',
			price: 249.99,
			currency: '$',
			priceChange7d: -20.0,
			imageUrl:
				'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&fit=crop&auto=format'
		},
		{
			id: 'p4',
			name: 'Sony WH-1000XM5 Wireless Headphones',
			site: 'Amazon',
			price: 379.99,
			currency: '$',
			priceChange7d: -20.0,
			imageUrl:
				'https://images.unsplash.com/photo-1615433366992-1586f3b8fca5?w=400&fit=crop&auto=format'
		}
	];

	const trendingDrops = [
		{
			id: 't1',
			name: 'Apple MacBook Pro 14-inch M3',
			currentPrice: 1599.0,
			previousPrice: 1999.0,
			dropPercentage: 20,
			currency: '$',
			imageUrl:
				'https://images.unsplash.com/photo-1675668409245-955188b96bf6?w=600&fit=crop&auto=format'
		},
		{
			id: 't2',
			name: 'Apple Watch Series 9 GPS 45mm',
			currentPrice: 359.0,
			previousPrice: 429.0,
			dropPercentage: 16,
			currency: '$',
			imageUrl:
				'https://images.unsplash.com/photo-1665860455418-017fa50d29bc?w=600&fit=crop&auto=format'
		},
		{
			id: 't3',
			name: 'Sony Alpha a7 IV Mirrorless Camera',
			currentPrice: 2298.0,
			previousPrice: 2498.0,
			dropPercentage: 8,
			currency: '$',
			imageUrl:
				'https://images.unsplash.com/photo-1729655669048-a667a0b01148?w=600&fit=crop&auto=format'
		}
	];

	const mostTracked = [
		{
			id: 'm1',
			name: 'Apple AirPods Pro (2nd Generation)',
			price: 249.99,
			currency: '$',
			trackingCount: 1247,
			imageUrl:
				'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&fit=crop&auto=format'
		},
		{
			id: 'm2',
			name: 'Logitech MX Master 3S Wireless Mouse',
			price: 99.99,
			currency: '$',
			trackingCount: 892,
			imageUrl:
				'https://images.unsplash.com/photo-1616296425622-4560a2ad83de?w=400&fit=crop&auto=format'
		},
		{
			id: 'm3',
			name: 'Sony WH-1000XM5 Wireless Headphones',
			price: 379.99,
			currency: '$',
			trackingCount: 756,
			imageUrl:
				'https://images.unsplash.com/photo-1615433366992-1586f3b8fca5?w=400&fit=crop&auto=format'
		},
		{
			id: 'm4',
			name: 'Keychron K2 Wireless Mechanical Keyboard',
			price: 89.99,
			currency: '$',
			trackingCount: 634,
			imageUrl:
				'https://images.unsplash.com/photo-1656711081969-9d16ebc2d210?w=400&fit=crop&auto=format'
		}
	];

	const siteColors: Record<string, { bg: string; text: string }> = {
		Amazon: { bg: '#fef3e8', text: '#c97d32' },
		eBay: { bg: '#fef9e8', text: '#c9a832' },
		AliExpress: { bg: '#fee8e8', text: '#c93232' },
		Taobao: { bg: '#fef0e8', text: '#c96332' },
		'1688': { bg: '#fef5e8', text: '#c99532' }
	};
</script>

<!-- Sticky header -->
<div
	class="sticky top-0 z-10 bg-white px-6 py-5 sm:px-8 sm:py-6"
	style="border-bottom: 1px solid rgba(45, 45, 42, 0.06);"
>
	<div class="flex items-center gap-3">
		<button
			type="button"
			onclick={toggleSidebar}
			aria-label="Toggle sidebar"
			class="flex size-9 shrink-0 items-center justify-center rounded-xl transition hover:bg-[#f7f6f3]"
			style="color: #6b6b65;"
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				class="size-4"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
				/>
			</svg>
		</button>
		<div>
			<h1
				class="text-2xl font-semibold sm:text-3xl"
				style="color: #1a1a17; letter-spacing: -0.02em;"
			>
				Home
			</h1>
			<p class="mt-0.5 hidden text-sm sm:block" style="color: #6b6b65;">
				Discover trending prices and personalized picks
			</p>
		</div>
	</div>
</div>

<!-- Content -->
<div class="space-y-12 p-6 sm:p-8 lg:p-10" style="max-width: 1400px;">

	<!-- Tracking Summary -->
	<div
		class="rounded-2xl bg-white p-7 shadow-sm"
		style="border: 1px solid rgba(45, 45, 42, 0.06);"
	>
		<div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
			<div>
				<h2
					class="mb-3 text-xl font-semibold"
					style="color: #1a1a17; letter-spacing: -0.01em;"
				>
					Your Tracking Summary
				</h2>
				<p class="mb-5 text-base" style="color: #1a1a17;">
					You are tracking <span class="font-semibold">3 items</span>.
				</p>
				<div class="flex flex-wrap items-center gap-6 text-sm" style="color: #6b6b65;">
					<div class="flex items-center gap-2">
						<!-- Clock icon -->
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="size-4 shrink-0"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							/>
						</svg>
						<span>Last update: <span class="font-medium" style="color: #1a1a17;">today</span></span>
					</div>
					<div class="flex items-center gap-2">
						<!-- TrendingDown icon -->
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="size-4 shrink-0"
							style="color: #5aad9c;"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 18 9 11.25l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
							/>
						</svg>
						<span>
							<span class="font-medium" style="color: #1a1a17;">2</span> price drops detected this week
						</span>
					</div>
				</div>
			</div>
			<a
				href="/"
				class="shrink-0 rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:shadow-md"
				style="background-color: #2d2d2a; color: #ffffff;"
			>
				View all items
			</a>
		</div>
	</div>

	<!-- Personalized Picks -->
	<div>
		<div class="mb-6">
			<h2 class="mb-1.5 text-xl font-semibold" style="color: #1a1a17; letter-spacing: -0.01em;">
				Personalized Picks
			</h2>
			<p class="text-sm" style="color: #6b6b65;">Based on your interests</p>
		</div>

		<div class="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
			{#each personalizedPicks as item}
				{@const siteStyle = siteColors[item.site] ?? { bg: '#f7f6f3', text: '#6b6b65' }}
				<div
					class="cursor-pointer rounded-2xl bg-white p-5 transition-all hover:shadow-lg"
					style="border: 1px solid rgba(45, 45, 42, 0.06);"
				>
					<!-- Image -->
					<div
						class="mb-4 aspect-square overflow-hidden rounded-xl"
						style="background-color: #f7f6f3;"
					>
						<img src={item.imageUrl} alt={item.name} class="size-full object-cover" />
					</div>

					<!-- Site badge -->
					<div class="mb-3">
						<span
							class="inline-block rounded-lg px-2.5 py-1 text-xs font-medium"
							style="background-color: {siteStyle.bg}; color: {siteStyle.text};"
						>
							{item.site}
						</span>
					</div>

					<!-- Title -->
					<h3
						class="mb-3 line-clamp-2 text-sm font-medium"
						style="color: #1a1a17; line-height: 1.5;"
					>
						{item.name}
					</h3>

					<!-- Price -->
					<div class="flex items-baseline gap-2">
						<span class="text-xl font-semibold" style="color: #1a1a17;">
							{item.currency}{item.price.toFixed(2)}
						</span>
						{#if item.priceChange7d !== 0}
							<span
								class="text-xs font-medium"
								style="color: {item.priceChange7d < 0 ? '#5aad9c' : '#d4183d'};"
							>
								{item.priceChange7d > 0 ? '+' : ''}{item.currency}{item.priceChange7d.toFixed(2)}
							</span>
						{/if}
					</div>
					<p class="mt-1 text-xs" style="color: #6b6b65;">7-day change</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Trending Price Drops -->
	<div>
		<div class="mb-6">
			<h2 class="mb-1.5 text-xl font-semibold" style="color: #1a1a17; letter-spacing: -0.01em;">
				Trending Price Drops
			</h2>
			<p class="text-sm" style="color: #6b6b65;">Biggest recent price drops across all sites</p>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
			{#each trendingDrops as item}
				<div
					class="cursor-pointer rounded-2xl bg-white p-5 transition-all hover:shadow-lg"
					style="border: 1px solid rgba(45, 45, 42, 0.06);"
				>
					<!-- Image (aspect-video) -->
					<div
						class="mb-4 aspect-video overflow-hidden rounded-xl"
						style="background-color: #f7f6f3;"
					>
						<img src={item.imageUrl} alt={item.name} class="size-full object-cover" />
					</div>

					<!-- Title -->
					<h3
						class="mb-4 line-clamp-2 text-sm font-medium"
						style="color: #1a1a17; line-height: 1.5;"
					>
						{item.name}
					</h3>

					<!-- Price + Drop badge -->
					<div class="mb-2 flex items-center justify-between">
						<span class="text-2xl font-semibold" style="color: #1a1a17;">
							{item.currency}{item.currentPrice.toFixed(2)}
						</span>
						<div class="rounded-lg px-3 py-1.5" style="background-color: #e8f2f0;">
							<span class="text-sm font-semibold" style="color: #5aad9c;">
								-{item.dropPercentage}%
							</span>
						</div>
					</div>

					<!-- Previous price -->
					<p class="text-xs" style="color: #6b6b65;">
						Was <span class="line-through"
							>{item.currency}{item.previousPrice.toFixed(2)}</span
						>
					</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Most Tracked Items -->
	<div>
		<div class="mb-6">
			<h2 class="mb-1.5 text-xl font-semibold" style="color: #1a1a17; letter-spacing: -0.01em;">
				Most Tracked Items
			</h2>
			<p class="text-sm" style="color: #6b6b65;">Popular products tracked by the community</p>
		</div>

		<div class="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
			{#each mostTracked as item}
				<div
					class="cursor-pointer rounded-2xl bg-white p-5 transition-all hover:shadow-lg"
					style="border: 1px solid rgba(45, 45, 42, 0.06);"
				>
					<!-- Image -->
					<div
						class="mb-4 aspect-square overflow-hidden rounded-xl"
						style="background-color: #f7f6f3;"
					>
						<img src={item.imageUrl} alt={item.name} class="size-full object-cover" />
					</div>

					<!-- Title -->
					<h3
						class="mb-3 line-clamp-2 text-sm font-medium"
						style="color: #1a1a17; line-height: 1.5;"
					>
						{item.name}
					</h3>

					<!-- Price -->
					<div class="mb-2">
						<span class="text-xl font-semibold" style="color: #1a1a17;">
							{item.currency}{item.price.toFixed(2)}
						</span>
					</div>

					<!-- Tracking count -->
					<div class="flex items-center gap-1.5 text-xs" style="color: #6b6b65;">
						<!-- Users icon -->
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="size-3.5 shrink-0"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
							/>
						</svg>
						<span>{item.trackingCount.toLocaleString()} tracking</span>
					</div>
				</div>
			{/each}
		</div>
	</div>

</div>
