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
				개인정보처리방침
			</h1>
			<p class="mt-0.5 hidden text-sm sm:block" style="color: #6b6b65;">시행일: {effectiveDate}</p>
		</div>
	</div>
</div>

<!-- Content -->
<div class="p-6 sm:p-8 lg:p-10">
	<div class="mx-auto max-w-2xl">
		<div class="rounded-2xl bg-white p-7 sm:p-8" style="border: 1px solid rgba(45, 45, 42, 0.06);">
			<p class="mb-8 text-sm leading-relaxed" style="color: #6b6b65;">
				Price Eye(이하 "서비스")는 개인정보 보호법 및 관련 법령을 준수하며, 이용자의 개인정보를
				소중히 보호합니다. 본 방침은 서비스가 수집하는 정보와 그 이용 방법을 설명합니다.
			</p>

			<!-- Quick summary -->
			<div class="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
				{#each [{ icon: 'collect', label: '수집 최소화', desc: '서비스 운영에 필요한 최소한의 정보만 수집합니다.' }, { icon: 'no-sell', label: '제3자 미판매', desc: '개인정보를 제3자에게 판매하거나 임의로 제공하지 않습니다.' }, { icon: 'delete', label: '삭제 보장', desc: '요청 시 30일 이내 모든 개인정보를 삭제합니다.' }] as item (item.icon)}
					<div class="rounded-xl p-4 text-center" style="background-color: #f7f6f3;">
						<p class="mb-1 text-xs font-semibold" style="color: #1a1a17;">{item.label}</p>
						<p class="text-xs leading-relaxed" style="color: #6b6b65;">{item.desc}</p>
					</div>
				{/each}
			</div>

			{#each [{ title: '제1조 (수집하는 개인정보)', body: '서비스 이용 과정에서 다음과 같은 정보가 수집됩니다.\n\n• 필수: 이메일 주소 (회원 식별 및 알림 발송)\n• 자동 수집: 서비스 이용 기록, 접속 IP, 브라우저 유형 (서비스 품질 개선 목적)\n• 결제 시: 결제 수단 정보 (PG사를 통해 처리되며, 당사는 카드 번호 전체를 저장하지 않습니다)\n\n비밀번호는 단방향 암호화(bcrypt)로 저장되며, 운영자도 복호화할 수 없습니다.' }, { title: '제2조 (개인정보 이용 목적)', body: '수집된 개인정보는 다음 목적으로만 사용됩니다.\n\n• 회원 가입 및 본인 확인\n• 가격 변동 이메일 알림 발송\n• 결제 처리 및 구독 관리\n• 고객 문의 응대\n• 서비스 개선을 위한 이용 현황 분석 (익명화 처리)' }, { title: '제3조 (개인정보 보유 및 파기)', body: '회원 탈퇴 요청 시 개인정보는 30일간 임시 보관 후 완전 삭제됩니다. 단, 관련 법령에 의해 보존이 필요한 경우 해당 기간까지 보관합니다.\n\n• 계약·청약 철회 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)\n• 전자금융거래 기록: 5년 (전자금융거래법)' }, { title: '제4조 (개인정보 제3자 제공)', body: '서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 다음의 경우는 예외로 합니다.\n\n• 이용자가 사전에 동의한 경우\n• 법령의 규정에 의거하거나 수사 목적으로 관계 기관이 요구하는 경우\n• 결제 처리를 위해 PG사(결제 대행사)에 최소한의 정보를 제공하는 경우' }, { title: '제5조 (쿠키 사용)', body: '서비스는 로그인 세션 유지를 위해 쿠키를 사용합니다. 쿠키에는 개인을 직접 식별할 수 있는 정보(이름, 주민번호 등)는 포함되지 않습니다. 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 로그인 상태 유지 등 일부 서비스 이용이 제한될 수 있습니다.' }, { title: '제6조 (이용자 권리)', body: '이용자는 언제든지 다음 권리를 행사할 수 있습니다.\n\n• 개인정보 열람·수정: 서비스 내 설정 메뉴에서 직접 변경 가능\n• 계정 탈퇴 및 데이터 삭제: 설정 > 계정 탈퇴 또는 이메일 요청\n• 마케팅 수신 거부: 이메일 하단 수신 거부 링크 또는 이메일 요청\n\n권리 행사 요청은 support@priceeye.com로 문의하시면 7영업일 이내 처리됩니다.' }, { title: '제7조 (개인정보 보호 조치)', body: '서비스는 개인정보 보호를 위해 다음과 같은 기술적·관리적 조치를 시행합니다.\n\n• 모든 통신 구간 SSL/TLS 암호화\n• 비밀번호 bcrypt 단방향 암호화 저장\n• 접근 권한 최소화 및 정기 검토\n• 개인정보 처리 내역 정기 점검' }, { title: '제8조 (개인정보 보호책임자)', body: '개인정보 관련 문의는 아래 담당자에게 연락해 주시기 바랍니다.\n\n이메일: support@priceeye.com\n응답 시간: 영업일 기준 2일 이내' }] as section, i (i)}
				<div class={i < 7 ? 'mb-7' : ''}>
					<h2 class="mb-3 text-sm font-semibold" style="color: #1a1a17;">{section.title}</h2>
					<p class="text-sm leading-relaxed whitespace-pre-line" style="color: #6b6b65;">
						{section.body}
					</p>
				</div>
			{/each}

			<div
				class="mt-8 rounded-xl p-4 text-xs leading-relaxed"
				style="background-color: #f7f6f3; color: #6b6b65;"
			>
				문의: <a
					href="mailto:support@priceeye.com"
					class="underline underline-offset-2"
					style="color: #1a1a17;">support@priceeye.com</a
				>
				· 시행일: {effectiveDate}
			</div>
		</div>
	</div>
</div>
