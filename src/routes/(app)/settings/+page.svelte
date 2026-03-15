<script lang="ts">
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.svelte';

	const toggleSidebar = getContext<() => void>('toggleSidebar');

	// Profile
	let emailValue = $state(auth.user?.email ?? '');

	// Password change
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let passwordLoading = $state(false);
	let passwordSuccess = $state(false);
	let passwordError = $state('');

	// Notifications
	let emailNotif = $state(true);
	let notifSaveLoading = $state(false);
	let notifSaveSuccess = $state(false);

	// Delete account
	let deleteConfirmText = $state('');
	let deleteLoading = $state(false);
	let showDeleteModal = $state(false);

	const planLabel: Record<string, string> = {
		free: 'Free',
		pro: 'Pro'
	};

	async function handlePasswordChange() {
		passwordError = '';
		if (!currentPassword || !newPassword || !confirmPassword) {
			passwordError = '모든 항목을 입력해 주세요.';
			return;
		}
		if (newPassword !== confirmPassword) {
			passwordError = '새 비밀번호가 일치하지 않습니다.';
			return;
		}
		if (newPassword.length < 8) {
			passwordError = '비밀번호는 8자 이상이어야 합니다.';
			return;
		}
		passwordLoading = true;
		// TODO: 실제 API 연동
		await new Promise((r) => setTimeout(r, 800));
		passwordLoading = false;
		passwordSuccess = true;
		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
		setTimeout(() => (passwordSuccess = false), 3000);
	}

	async function handleNotifSave() {
		notifSaveLoading = true;
		// TODO: 실제 API 연동
		await new Promise((r) => setTimeout(r, 500));
		notifSaveLoading = false;
		notifSaveSuccess = true;
		setTimeout(() => (notifSaveSuccess = false), 3000);
	}

	async function handleDeleteAccount() {
		if (deleteConfirmText !== '탈퇴') return;
		deleteLoading = true;
		// TODO: 실제 API 연동
		await new Promise((r) => setTimeout(r, 1000));
		auth.logout();
		goto('/auth/login');
	}
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
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
			</svg>
		</button>
		<div>
			<h1 class="text-2xl font-semibold sm:text-3xl" style="color: #1a1a17; letter-spacing: -0.02em;">설정</h1>
			<p class="mt-0.5 hidden text-sm sm:block" style="color: #6b6b65;">계정 및 알림 설정을 관리합니다.</p>
		</div>
	</div>
</div>

<!-- Content -->
<div class="p-6 sm:p-8 lg:p-10">
	<div class="mx-auto max-w-2xl space-y-6">

		<!-- Account Info -->
		<section class="rounded-2xl bg-white p-7 sm:p-8" style="border: 1px solid rgba(45, 45, 42, 0.06);">
			<h2 class="mb-6 text-base font-semibold" style="color: #1a1a17;">계정 정보</h2>

			<div class="space-y-5">
				<!-- Email -->
				<div>
					<label class="mb-1.5 block text-sm font-medium" style="color: #1a1a17;" for="email">
						이메일
					</label>
					<input
						id="email"
						type="email"
						value={emailValue}
						disabled
						class="w-full rounded-xl px-4 py-2.5 text-sm"
						style="
							background-color: #f7f6f3;
							border: 1px solid rgba(45, 45, 42, 0.1);
							color: #6b6b65;
							outline: none;
						"
					/>
					<p class="mt-1.5 text-xs" style="color: #6b6b65;">이메일은 변경할 수 없습니다. 변경이 필요한 경우 support@gugu.plus로 문의해 주세요.</p>
				</div>

				<!-- Plan -->
				<div class="flex items-center justify-between rounded-xl p-4" style="background-color: #f7f6f3;">
					<div>
						<p class="text-sm font-medium" style="color: #1a1a17;">현재 플랜</p>
						<p class="mt-0.5 text-xs" style="color: #6b6b65;">
							{#if auth.plan.type === 'free'}
								최대 5개 상품 추적 · 14일 히스토리
							{:else}
								최대 50개 상품 추적 · 무제한 히스토리
							{/if}
						</p>
					</div>
					<div class="flex items-center gap-3">
						<span
							class="rounded-lg px-2.5 py-1 text-xs font-semibold"
							style="
								background-color: {auth.plan.type === 'pro' ? '#e8f2f0' : 'rgba(45,45,42,0.06)'};
								color: {auth.plan.type === 'pro' ? '#3a8a7a' : '#6b6b65'};
							"
						>
							{planLabel[auth.plan.type] ?? auth.plan.type}
						</span>
						{#if auth.plan.type === 'free'}
							<a
								href="/plan"
								class="rounded-xl px-3.5 py-2 text-xs font-medium text-white transition hover:opacity-90"
								style="background-color: #2d2d2a;"
							>
								업그레이드
							</a>
						{/if}
					</div>
				</div>
			</div>
		</section>

		<!-- Password Change -->
		<section class="rounded-2xl bg-white p-7 sm:p-8" style="border: 1px solid rgba(45, 45, 42, 0.06);">
			<h2 class="mb-6 text-base font-semibold" style="color: #1a1a17;">비밀번호 변경</h2>

			<div class="space-y-4">
				<div>
					<label class="mb-1.5 block text-sm font-medium" style="color: #1a1a17;" for="current-pw">
						현재 비밀번호
					</label>
					<input
						id="current-pw"
						type="password"
						bind:value={currentPassword}
						placeholder="현재 비밀번호 입력"
						class="w-full rounded-xl px-4 py-2.5 text-sm transition"
						style="
							background-color: #f7f6f3;
							border: 1px solid rgba(45, 45, 42, 0.1);
							color: #1a1a17;
							outline: none;
						"
					/>
				</div>
				<div>
					<label class="mb-1.5 block text-sm font-medium" style="color: #1a1a17;" for="new-pw">
						새 비밀번호
					</label>
					<input
						id="new-pw"
						type="password"
						bind:value={newPassword}
						placeholder="8자 이상"
						class="w-full rounded-xl px-4 py-2.5 text-sm transition"
						style="
							background-color: #f7f6f3;
							border: 1px solid rgba(45, 45, 42, 0.1);
							color: #1a1a17;
							outline: none;
						"
					/>
				</div>
				<div>
					<label class="mb-1.5 block text-sm font-medium" style="color: #1a1a17;" for="confirm-pw">
						새 비밀번호 확인
					</label>
					<input
						id="confirm-pw"
						type="password"
						bind:value={confirmPassword}
						placeholder="새 비밀번호 재입력"
						class="w-full rounded-xl px-4 py-2.5 text-sm transition"
						style="
							background-color: #f7f6f3;
							border: 1px solid rgba(45, 45, 42, 0.1);
							color: #1a1a17;
							outline: none;
						"
					/>
				</div>

				{#if passwordError}
					<p class="text-xs" style="color: #d4183d;">{passwordError}</p>
				{/if}

				<div class="flex items-center gap-3 pt-1">
					<button
						type="button"
						onclick={handlePasswordChange}
						disabled={passwordLoading}
						class="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
						style="background-color: #2d2d2a;"
					>
						{#if passwordLoading}
							<svg class="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
							</svg>
						{/if}
						변경하기
					</button>
					{#if passwordSuccess}
						<span class="flex items-center gap-1.5 text-sm" style="color: #3a8a7a;">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
							</svg>
							변경되었습니다.
						</span>
					{/if}
				</div>
			</div>
		</section>

		<!-- Notifications -->
		<section class="rounded-2xl bg-white p-7 sm:p-8" style="border: 1px solid rgba(45, 45, 42, 0.06);">
			<h2 class="mb-6 text-base font-semibold" style="color: #1a1a17;">알림 설정</h2>

			<div class="space-y-4">
				<div class="flex items-center justify-between gap-4">
					<div>
						<p class="text-sm font-medium" style="color: #1a1a17;">이메일 알림</p>
						<p class="mt-0.5 text-xs leading-relaxed" style="color: #6b6b65;">
							추적 중인 상품의 가격이 변동되면 이메일로 알려드립니다.
						</p>
					</div>
					<button
						type="button"
						role="switch"
						aria-checked={emailNotif}
						onclick={() => (emailNotif = !emailNotif)}
						class="relative shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none"
						style="width: 44px; height: 24px; background-color: {emailNotif ? '#2d2d2a' : 'rgba(45,45,42,0.2)'};"
					>
						<span
							class="absolute rounded-full bg-white transition-all duration-200"
							style="width: 18px; height: 18px; top: 3px; left: {emailNotif ? '23px' : '3px'}; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"
						></span>
					</button>
				</div>

				<div class="flex items-center gap-3 pt-1">
					<button
						type="button"
						onclick={handleNotifSave}
						disabled={notifSaveLoading}
						class="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
						style="background-color: #2d2d2a;"
					>
						{#if notifSaveLoading}
							<svg class="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
							</svg>
						{/if}
						저장
					</button>
					{#if notifSaveSuccess}
						<span class="flex items-center gap-1.5 text-sm" style="color: #3a8a7a;">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
							</svg>
							저장되었습니다.
						</span>
					{/if}
				</div>
			</div>
		</section>

		<!-- Danger Zone -->
		<section class="rounded-2xl bg-white p-7 sm:p-8" style="border: 1px solid rgba(212, 24, 61, 0.15);">
			<h2 class="mb-1.5 text-base font-semibold" style="color: #d4183d;">위험 구역</h2>
			<p class="mb-6 text-sm" style="color: #6b6b65;">아래 작업은 되돌릴 수 없습니다. 신중하게 진행해 주세요.</p>

			<div class="rounded-xl p-4" style="background-color: #fff5f6; border: 1px solid rgba(212, 24, 61, 0.1);">
				<div class="flex items-start justify-between gap-4">
					<div>
						<p class="text-sm font-medium" style="color: #1a1a17;">계정 탈퇴</p>
						<p class="mt-0.5 text-xs leading-relaxed" style="color: #6b6b65;">
							계정을 탈퇴하면 모든 추적 데이터와 히스토리가 30일 후 영구 삭제됩니다.
						</p>
					</div>
					<button
						type="button"
						onclick={() => (showDeleteModal = true)}
						class="shrink-0 rounded-xl px-4 py-2 text-xs font-medium transition hover:opacity-90"
						style="background-color: #fee8e8; color: #d4183d;"
					>
						탈퇴하기
					</button>
				</div>
			</div>
		</section>

	</div>
</div>

<!-- Delete Account Modal -->
{#if showDeleteModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		style="background-color: rgba(0,0,0,0.4);"
		role="presentation"
		onclick={(e) => { if (e.target === e.currentTarget) showDeleteModal = false; }}
	>
		<div class="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl">
			<div class="mb-5 flex size-12 items-center justify-center rounded-xl" style="background-color: #fee8e8;">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-6" style="color: #d4183d;" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
				</svg>
			</div>
			<h3 class="mb-2 text-lg font-semibold" style="color: #1a1a17;">정말 탈퇴하시겠습니까?</h3>
			<p class="mb-6 text-sm leading-relaxed" style="color: #6b6b65;">
				모든 추적 상품, 가격 히스토리, 알림 설정이 30일 후 영구 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
			</p>

			<div class="mb-5">
				<label class="mb-1.5 block text-sm font-medium" style="color: #1a1a17;" for="delete-confirm">
					확인을 위해 <strong>탈퇴</strong>를 입력해 주세요.
				</label>
				<input
					id="delete-confirm"
					type="text"
					bind:value={deleteConfirmText}
					placeholder="탈퇴"
					class="w-full rounded-xl px-4 py-2.5 text-sm"
					style="
						background-color: #f7f6f3;
						border: 1px solid rgba(45, 45, 42, 0.1);
						color: #1a1a17;
						outline: none;
					"
				/>
			</div>

			<div class="flex gap-3">
				<button
					type="button"
					onclick={() => { showDeleteModal = false; deleteConfirmText = ''; }}
					class="flex-1 rounded-xl py-2.5 text-sm font-medium transition hover:bg-[#efefed]"
					style="background-color: #f7f6f3; color: #1a1a17;"
				>
					취소
				</button>
				<button
					type="button"
					onclick={handleDeleteAccount}
					disabled={deleteConfirmText !== '탈퇴' || deleteLoading}
					class="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40"
					style="background-color: #d4183d;"
				>
					{#if deleteLoading}
						<svg class="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
						</svg>
					{/if}
					탈퇴하기
				</button>
			</div>
		</div>
	</div>
{/if}
