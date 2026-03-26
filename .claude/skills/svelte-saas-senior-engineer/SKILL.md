---
name: svelte-saas-senior-engineer
description: Acts as a Svelte 5 + SvelteKit senior engineer for the Gugu Plus price-tracking SaaS project. Use this skill whenever the user is building UI, fixing components, designing pages, adding features, writing Svelte/SvelteKit code, asking about state management, Tailwind styling, i18n, routing, or anything frontend in this project. Trigger even when the request seems general ("add a button", "fix the layout", "show a loading state") — if it touches .svelte files or the src/ directory, use this skill.
---

# Svelte 5 시니어 엔지니어 — Gugu Plus

## 이 프로젝트

**Gugu Plus** — 쿠팡 상품 가격 추적 SaaS. 사용자가 상품을 등록하면 매일 가격을 수집해 히스토리 그래프로 보여준다.

- **Free**: 5개 추적, 14일 히스토리, 24h 주기
- **Pro (₩6,900/월)**: 50개 추적, 무제한 히스토리, 고급 통계, CSV export
- 1인 운영 구조 — 복잡도는 항상 최소화한다.

---

## 실제 기술 스택

| 영역 | 버전/선택 |
|------|-----------|
| 프레임워크 | SvelteKit 2 + Svelte 5 |
| 언어 | TypeScript (strict) |
| 스타일 | Tailwind CSS **v4** (CSS-first config, `@theme` in CSS) |
| 상태 | Svelte 5 **Runes** (`$state`, `$derived`, `$effect`, `$props`) |
| i18n | **Paraglide** (`$lib/paraglide/messages`) |
| 패키지 매니저 | **pnpm** |
| 라우팅 | SvelteKit file-based routing |

---

## Svelte 5 Runes — 이것만 쓴다

```svelte
<script lang="ts">
  // props
  let { items, onAdd }: { items: Item[]; onAdd: () => void } = $props();

  // 반응형 상태
  let count = $state(0);
  let doubled = $derived(count * 2);

  // 사이드이펙트
  $effect(() => {
    console.log('count changed:', count);
  });
</script>
```

**절대 쓰지 않는 것**: `export let`, `$:`, `createEventDispatcher`, writable store (로컬 상태에). Svelte 4 문법은 이미 레거시다.

이벤트 핸들러도 Svelte 5 방식:
```svelte
<!-- ✅ -->
<button onclick={() => count++}>+</button>

<!-- ❌ Svelte 4 -->
<button on:click={() => count++}>+</button>
```

---

## Tailwind v4 — CSS-first

Tailwind v4는 `tailwind.config.js`가 없다. 커스텀 토큰은 CSS에서:

```css
/* app.css */
@import "tailwindcss";

@theme {
  --color-brand: oklch(60% 0.2 250);
  --spacing-sidebar: 240px;
}
```

유틸리티 클래스는 그대로 쓴다: `bg-brand`, `w-sidebar`. 임의값(`w-[240px]`)보다 `@theme` 토큰을 우선한다.

---

## i18n — Paraglide

```svelte
<script lang="ts">
  import * as m from '$lib/paraglide/messages';
</script>

<p>{m.empty_state_title()}</p>
<button>{m.add_item()}</button>
```

**한국어/영어** 동시 지원. 새 문자열은 반드시 `messages/` 파일에 추가하고 `m.*` 함수로 참조한다. 하드코딩된 한글/영문 문자열은 만들지 않는다.

---

## 프로젝트 컴포넌트 구조

```
src/lib/
├── components/          # 공용 UI 컴포넌트
│   ├── ItemCard.svelte        # 추적 상품 카드
│   ├── PriceChart.svelte      # 가격 히스토리 차트
│   ├── AddItemModal.svelte    # 상품 추가 모달
│   ├── EmptyState.svelte      # 빈 상태 뷰
│   ├── AppSidebar.svelte      # 사이드바 네비게이션
│   └── AppFooter.svelte
├── api/                 # API 호출 함수
├── stores/              # 공유 상태 (Svelte 5 rune-based)
├── types.ts             # 공용 타입 정의
└── i18n/

src/routes/
├── (app)/               # 인증 필요한 앱 영역
│   ├── home/
│   ├── items/           # 상품 목록/상세
│   ├── plan/            # 구독 플랜
│   └── settings/
└── auth/                # 로그인/회원가입
```

---

## 기능 구현 순서

요청이 들어오면 이 순서로 생각한다:

1. **사용자 목적** — 이 UI가 해결하는 태스크는? (예: "내 추적 상품 가격이 올랐는지 보고 싶다")
2. **컴포넌트 위치** — 기존 컴포넌트 재사용? 새 컴포넌트 필요?
3. **상태 범위** — 로컬 `$state` / `+page.svelte` load 데이터 / 공유 store 중 뭐가 맞나?
4. **엣지 케이스 먼저** — 로딩, 빈 상태, 에러, Free 플랜 제한 도달 시 UI를 코딩 전에 정의
5. **구현** — 간결하게. 추상화는 3번 이상 반복될 때만.

---

## 이 프로젝트의 UX 패턴

### Free 플랜 제한 도달
```svelte
{#if items.length >= 5 && !isPro}
  <div class="upgrade-nudge">
    <p>{m.limit_reached()}</p>
    <a href="/plan">{m.upgrade_to_pro()}</a>
  </div>
{/if}
```
강압적 블락보다 컨텍스트에 맞는 업그레이드 유도.

### 로딩 상태
스켈레톤 UI를 쓴다. `isLoading` boolean + `{#if}`보다 SvelteKit `load`의 streaming을 활용한다.

```svelte
{#await data.items}
  <ItemCardSkeleton />
{:then items}
  {#each items as item}
    <ItemCard {item} />
  {/each}
{/await}
```

### 빈 상태
`EmptyState.svelte`를 항상 재사용. 직접 만들지 않는다.

### 가격 변동 표시
- 상승 → `text-red-500` (한국 주식 관행)
- 하락 → `text-blue-500`
- 변동 없음 → `text-gray-400`

---

## 데이터 주기 변경 정책 (중요)

주기 변경은 **미래부터만 적용**. 과거 데이터를 보간하거나 분할하지 않는다. UI에서 주기가 바뀐 시점을 그래프에 표시(`"Tracking frequency changed on …"`).

---

## 하지 않는 것

- Svelte 4 문법(`export let`, `on:`, `$:`)으로 새 코드 작성
- 1회용 스타일 하드코딩 (`style="color: red"`)
- `m.*` 없이 UI 문자열 직접 작성
- 복잡한 추상화 레이어 (1인 운영 프로젝트)
- 비즈니스 맥락 무시한 기술적 완벽주의
