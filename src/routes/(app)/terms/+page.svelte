<script lang="ts">
	import { getContext } from 'svelte';
	const toggleSidebar = getContext<() => void>('toggleSidebar');
	const effectiveDate = '2025년 1월 1일';
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
			<h1 class="text-2xl font-semibold sm:text-3xl" style="color: #1a1a17; letter-spacing: -0.02em;">이용약관</h1>
			<p class="mt-0.5 hidden text-sm sm:block" style="color: #6b6b65;">시행일: {effectiveDate}</p>
		</div>
	</div>
</div>

<!-- Content -->
<div class="p-6 sm:p-8 lg:p-10">
	<div class="mx-auto max-w-2xl">
		<div class="rounded-2xl bg-white p-7 sm:p-8" style="border: 1px solid rgba(45, 45, 42, 0.06);">

			<p class="mb-8 text-sm leading-relaxed" style="color: #6b6b65;">
				본 이용약관은 Gugu Plus(이하 "서비스")를 이용하는 회원과 운영자 간의 권리·의무 및 책임 사항을 규정합니다. 서비스를 이용하면 본 약관에 동의한 것으로 간주합니다.
			</p>

			{#each [
				{
					title: '제1조 (서비스 목적)',
					body: 'Gugu Plus는 Amazon, eBay, AliExpress, Taobao 등 주요 글로벌 쇼핑 플랫폼의 상품 가격을 매일 수집하여 장기 히스토리 데이터를 제공하는 개인용 가격 추적 도구입니다. 본 서비스는 실시간 알림 서비스가 아니며, 매일 1회 데이터를 갱신합니다.'
				},
				{
					title: '제2조 (회원 가입 및 계정)',
					body: '회원 가입은 이메일 주소 인증을 통해 이루어집니다. 회원은 자신의 계정 정보를 안전하게 관리할 책임이 있으며, 타인에게 계정 정보를 공유해서는 안 됩니다. 부정 이용이 확인될 경우 사전 통지 없이 계정이 정지될 수 있습니다.'
				},
				{
					title: '제3조 (플랜 및 결제)',
					body: 'Free 플랜은 영구 무료로 제공되며 5개 상품 추적 및 14일 히스토리를 지원합니다. Pro 플랜은 월 ₩6,900(또는 연 ₩59,000)에 제공되며, 50개 상품 추적·무제한 히스토리·고급 통계·CSV 내보내기 기능을 포함합니다. 결제는 선불 방식으로 처리되며, 결제 시점부터 구독 기간이 시작됩니다.'
				},
				{
					title: '제4조 (환불 정책)',
					body: '결제 후 7일 이내 환불 요청 시 전액 환불됩니다. 7일 이후에는 남은 구독 기간에 비례하여 환불됩니다. 환불 요청은 support@gugu.plus로 문의하시기 바랍니다. 연간 구독을 취소할 경우 즉시 청구가 중단되며, 남은 기간은 일할 계산으로 환불됩니다.'
				},
				{
					title: '제5조 (데이터 정책)',
					body: '수집된 가격 데이터는 회원 개인의 자산으로 취급됩니다. Pro → Free 다운그레이드 시 기존 데이터는 삭제되지 않으며, 14일 이전 데이터는 잠금 처리됩니다. 재구독 시 전체 히스토리가 즉시 복원됩니다. 가격 업데이트 주기 변경은 변경 시점 이후부터 적용되며, 이전 데이터는 원본 해상도로 그대로 보존됩니다. 계정 삭제 요청 시 데이터는 30일간 보관 후 완전 삭제됩니다.'
				},
				{
					title: '제6조 (서비스 이용 제한)',
					body: '자동화된 방식으로 서비스를 과도하게 이용하거나, 서비스의 정상적인 운영을 방해하는 행위는 금지됩니다. 한 계정당 하나의 플랜만 적용되며, 플랜 기준을 초과하는 이용이 확인될 경우 서비스 이용이 제한될 수 있습니다.'
				},
				{
					title: '제7조 (책임의 한계)',
					body: 'Gugu Plus는 수집된 가격 데이터의 완전한 정확성을 보장하지 않습니다. 제3자 쇼핑 플랫폼의 정책 변경, 서버 장애, 또는 불가항력적 사유로 인한 데이터 누락에 대해 책임을 지지 않습니다. 서비스를 통해 제공되는 정보를 구매 결정의 유일한 근거로 사용하는 것은 권장하지 않습니다.'
				},
				{
					title: '제8조 (약관 변경)',
					body: '운영자는 관련 법령 또는 서비스 정책에 따라 본 약관을 변경할 수 있습니다. 약관이 변경될 경우 시행일 7일 전에 이메일 또는 서비스 내 공지를 통해 안내합니다. 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.'
				},
				{
					title: '제9조 (분쟁 해결)',
					body: '본 약관과 관련한 분쟁은 대한민국 법령을 적용하며, 소송이 필요한 경우 운영자의 소재지를 관할하는 법원을 1심 법원으로 합니다. 분쟁 발생 시 먼저 support@gugu.plus로 연락하여 협의를 통한 해결을 시도합니다.'
				}
			] as section, i}
				<div class="{i < 8 ? 'mb-7' : ''}">
					<h2 class="mb-3 text-sm font-semibold" style="color: #1a1a17;">{section.title}</h2>
					<p class="text-sm leading-relaxed" style="color: #6b6b65;">{section.body}</p>
				</div>
			{/each}

			<div class="mt-8 rounded-xl p-4 text-xs leading-relaxed" style="background-color: #f7f6f3; color: #6b6b65;">
				문의: <a href="mailto:support@gugu.plus" class="underline underline-offset-2" style="color: #1a1a17;">support@gugu.plus</a>
				· 시행일: {effectiveDate}
			</div>
		</div>
	</div>
</div>
