# Architecture Review - Gugu Plus Client

> 작성일: 2026-03-16
> 대상: SKILL.md 아키텍처 가이드, items/[id]/+page.svelte, settings/+page.svelte

---

## 1. 현재 프로젝트 현황

| 항목 | 수치 |
|------|------|
| 전체 코드량 | ~5,173 lines (38 files) |
| 프레임워크 | SvelteKit 2 + Svelte 5 (Runes) |
| 가장 큰 파일 | product-dummy.ts (1,061줄), items/[id]/+page.svelte (539줄) |
| domain/ 폴더 | 없음 |
| service/reader/writer 패턴 | 없음 |
| API 레이어 | 있음 (client.ts, endpoints.ts, auth.ts) |

---

## 2. SKILL.md 리뷰: 과한 추상화인가?

### 결론: 현재 프로젝트 규모 대비 과하다

SKILL.md에서 기술한 아키텍처는 **백엔드의 레이어드 아키텍처(Spring Boot 스타일)**를 프론트엔드에 그대로 이식한 형태다.

```
Presentation → Business(-service) → Implement(-reader, -writer) → Data Access(storage/)
```

**문제는 프로젝트 규모와의 괴리다:**

- 전체 코드가 5,173줄, 38개 파일인 프로젝트에 4개 레이어 + 격벽(index.ts) + 네이밍 컨벤션 규칙은 과하다
- 현재 비즈니스 로직이라 부를 수 있는 코드가 거의 없다. 대부분 더미 데이터 → UI 렌더링이다
- `order-service.ts` → `order-reader.ts` → `storage/` 같은 3단계 위임이 정당화되려면, 각 레이어에 실질적 책임이 있어야 한다
- 현 단계에서는 API 호출 → 화면 표시가 전부이므로 중간 레이어가 pass-through만 하게 된다

### SKILL.md에서 좋은 부분

| 원칙 | 평가 |
|------|------|
| 개념(Concept) 단위 분리 | 올바른 방향. 단, 지금은 개념이 2-3개뿐 |
| 격벽(index.ts로 공개 인터페이스 제한) | 프로젝트가 커지면 유용. 지금은 과잉 |
| 레이어를 네이밍으로 구분 | 좋은 아이디어. 폴더 중첩보다 낫다 |
| storage/ 기술 격리 | API 클라이언트 격리는 이미 하고 있다 (lib/api/) |
| components vs 횡단기능 구분 | 명확한 기준이라 유용 |

### SKILL.md에서 과한 부분

| 원칙 | 문제 |
|------|------|
| 4단계 레이어 강제 | 프론트엔드에서 Business → Implement → Data Access 3단 위임은 대부분 pass-through |
| "건너뛰기 금지" | `service`에서 `storage`를 직접 호출 못하면, 1줄짜리 reader를 만들어야 한다 |
| 동일 레이어 참조 금지 | service 간 조합이 필요한 경우가 실제로 존재한다 |
| 모든 개념에 index.ts 격벽 | 2-3개 파일로 구성된 개념에 index.ts는 보일러플레이트만 늘린다 |
| 백엔드 용어 대응 (Controller ≈ Page) | 비유로는 좋지만, 프론트엔드의 특성(반응형 상태, 컴포넌트 트리)을 무시하게 된다 |

### 제안: 단계적 적용

현재 프로젝트 규모에서는 **2단계면 충분하다:**

```
Page(Presentation) → Domain Logic + API(Business)
```

프로젝트가 성장하면서 단계적으로 적용:

| 프로젝트 규모 | 적용 수준 |
|--------------|----------|
| ~5K lines (현재) | Page → lib/domain/{concept}.ts (service 하나로 충분) |
| ~15K lines | Page → service → API client, 개념별 폴더 분리 |
| ~50K+ lines | SKILL.md의 풀 아키텍처 적용 고려 |

---

## 3. items/[id]/+page.svelte 리뷰 (539줄)

### 문제 분석

**script 블록 (1-242줄, 약 242줄):**

| 구간 | 줄 수 | 내용 | 분리 가능 여부 |
|------|-------|------|--------------|
| 타입 정의 | 1-32 | ParsedSku, ColorOption, PriceEntry, ItemDetail | 별도 types.ts로 분리 가능 |
| 더미 히스토리 생성 | 34-67 | genHistory() | API 연동 시 제거될 코드 |
| 헬퍼 함수 | 69-99 | parseKRW, sourceToSite, formatKRW, parseSkus | 도메인 로직. 분리 대상 |
| 아이템 맵 구성 | 101-138 | 더미 데이터 → ItemDetail 변환 | API 연동 시 제거될 코드 |
| 반응형 상태 + 파생 | 140-224 | selectedColor, sizeOptions, currentSku 등 | 일부 로직 분리 가능 |
| 이벤트 핸들러 | 226-241 | selectColor, handleDelete | 페이지에 남아도 됨 |

**template 블록 (244-539줄, 약 295줄):**

| 구간 | 줄 수 | 컴포넌트화 가능 |
|------|-------|----------------|
| Sticky header | 252-302 | ItemDetailHeader.svelte |
| Image 영역 | 311-329 | 작아서 분리 불필요 |
| Price card | 334-365 | PriceCard.svelte |
| Tracking settings | 368-408 | TrackingSettings.svelte |
| SKU selector | 413-500 | SkuSelector.svelte |
| Price history | 503-535 | 이미 PriceChart 사용 중, 테이블만 분리 가능 |

### 핵심 문제

1. **더미 데이터 변환 로직이 페이지에 있다** - API 연동 시 어차피 사라질 코드지만, 지금도 ~100줄을 차지한다
2. **포맷터/파서가 페이지에 인라인** - `formatKRW`, `parseKRW`, `sourceToSite`는 다른 페이지(home)에서도 필요할 수 있다
3. **타입 정의가 페이지 내부** - 다른 컴포넌트에서 재사용 불가
4. **SKU 선택 로직의 복잡도** - colorOptions, sizeOptions, currentSku 파생이 연쇄적으로 엮여 있어 읽기 어렵다

### 분리 제안

```
src/lib/domain/item/
├── item.types.ts          # ParsedSku, ColorOption, PriceEntry, ItemDetail
├── item-formatter.ts      # formatKRW, parseKRW, sourceToSite
├── item-parser.ts         # parseSkus (SKU 파싱 로직)
└── index.ts               # 공개 인터페이스

src/lib/components/
├── SkuSelector.svelte     # 색상/사이즈 선택 UI + 로직
└── PriceHistoryTable.svelte  # 가격 변동 테이블
```

분리 후 +page.svelte 예상 줄 수: **~250줄** (데이터 페칭 + 레이아웃 조합)

---

## 4. settings/+page.svelte 리뷰 (408줄)

### State 분석

```typescript
// Profile (1개)
let emailValue = $state('')

// Password change (5개)
let currentPassword = $state('')
let newPassword = $state('')
let confirmPassword = $state('')
let passwordLoading = $state(false)
let passwordSuccess = $state(false)
let passwordError = $state('')

// Notifications (3개)
let emailNotif = $state(true)
let notifSaveLoading = $state(false)
let notifSaveSuccess = $state(false)

// Delete account (3개)
let deleteConfirmText = $state('')
let deleteLoading = $state(false)
let showDeleteModal = $state(false)
```

**총 12개의 $state** - 4개의 서로 다른 관심사가 하나의 파일에 섞여 있다.

### 핵심 문제

1. **4개 개념이 1개 파일에** - 비밀번호 변경, 알림 설정, 계정 탈퇴는 독립적인 기능이다
2. **각 기능의 loading/success/error 패턴이 반복** - 동일한 패턴이 3번 반복된다
3. **Validation이 핸들러에 인라인** - 비밀번호 validation 로직이 UI 핸들러 안에 있다
4. **Delete Modal이 페이지에 인라인** - 별도 컴포넌트로 분리 가능

### 분리 제안

```
src/routes/(app)/settings/
├── +page.svelte              # 레이아웃만 (~60줄)
├── PasswordChangeSection.svelte  # 비밀번호 변경 (~100줄)
├── NotificationSection.svelte    # 알림 설정 (~60줄)
├── DangerZoneSection.svelte      # 계정 탈퇴 + 모달 (~120줄)
└── AccountInfoSection.svelte     # 계정 정보 표시 (~40줄)
```

이 정도 분리면 충분하다. domain/ 폴더까지 만들 필요는 없다. 각 섹션 컴포넌트가 자신의 state와 핸들러를 가지면 된다.

---

## 5. 비즈니스 로직과 UI는 같이 있어야 하는가?

### 결론: 프론트엔드에서는 "적절한 동거"가 맞다

백엔드에서 Controller와 Service를 분리하는 이유:

- Controller는 HTTP 프로토콜에 의존하고, Service는 비즈니스 규칙에만 집중한다
- Service는 여러 Controller에서 재사용된다
- 테스트 시 HTTP 없이 비즈니스 로직만 테스트할 수 있다

**프론트엔드는 상황이 다르다:**

| 백엔드 | 프론트엔드 |
|--------|----------|
| Controller는 재사용 안 됨 | Page도 재사용 안 됨 |
| Service는 여러 Controller에서 사용 | 비즈니스 로직은 대부분 1개 페이지에서만 사용 |
| HTTP ↔ 비즈니스 경계가 명확 | UI 상태 ↔ 비즈니스 상태 경계가 모호 |
| Service가 수십 개 도구를 조합 | 프론트 서비스는 API 1-2개 호출이 전부 |

### 분리 기준

분리해야 할 때:

- **여러 페이지에서 같은 로직을 쓸 때** (예: `formatKRW`는 home, items, plan에서 다 쓴다)
- **로직이 복잡해서 테스트가 필요할 때** (예: SKU 선택 로직, 가격 계산)
- **API 응답을 가공하는 로직** (예: 서버 응답 → 화면용 데이터 변환)

분리하지 않아도 될 때:

- **해당 페이지에서만 쓰는 간단한 핸들러** (예: `handleDelete`)
- **UI 상태 관리** (예: `showDeleteModal`, `selectedColor`)
- **간단한 파생 값** (예: `discountPct`)

### 프론트엔드에 맞는 분리 원칙

```
"재사용 가능한 로직"과 "테스트 필요한 로직"만 분리한다.
나머지는 컴포넌트에 두는 것이 오히려 응집도가 높다.
```

백엔드처럼 "모든 비즈니스 로직을 service로"가 아니라:

```
Page.svelte
  ├── UI 상태 ($state) → 여기에 둔다
  ├── 이벤트 핸들러 → 여기에 둔다
  ├── 재사용 포맷터 → lib/domain/으로 분리
  ├── 복잡한 계산 로직 → lib/domain/으로 분리
  └── API 호출 → lib/api/에 이미 분리됨
```

---

## 6. 종합 제안

### 지금 당장 할 수 있는 것 (과하지 않은 수준)

1. **공통 포맷터 분리**
   ```
   src/lib/domain/price/
   ├── price-formatter.ts   # formatKRW, parseKRW
   └── index.ts
   ```

2. **settings 페이지 섹션 컴포넌트 분리**
   - 각 섹션이 자기 state를 가지도록 분리
   - +page.svelte는 레이아웃 조합만

3. **items/[id] 타입 분리**
   - `ParsedSku`, `ItemDetail` 등 → `src/lib/types/item.types.ts`
   - API 연동 시 자연스럽게 domain 폴더로 이동

4. **SKU 선택 컴포넌트 분리**
   - `SkuSelector.svelte` → 색상/사이즈 선택 UI + 관련 로직

### 하지 말아야 할 것

- 모든 페이지에 service 레이어를 강제하지 않는다
- 1줄짜리 reader/writer를 만들지 않는다
- index.ts 격벽을 2-3개 파일짜리 폴더에 적용하지 않는다
- 백엔드 레이어 구조를 그대로 이식하지 않는다

### SKILL.md 수정 방향

현재 SKILL.md를 **"프로젝트가 50K+ lines일 때의 목표 아키텍처"**로 재포지셔닝하고, 현재 규모에 맞는 **"현실적 가이드라인"** 섹션을 추가하는 것을 권장한다.

```markdown
## 현재 단계 가이드라인 (~5K lines)

1. 재사용되는 로직만 lib/domain/으로 분리
2. 페이지는 섹션 컴포넌트로 분할 (200줄 이하 목표)
3. API 클라이언트는 lib/api/에 유지 (이미 잘 되어 있음)
4. service 레이어는 복잡한 비즈니스 로직이 생길 때 도입
```

---

## 7. 폴더 구조 제안

### FSD를 채택하지 않는 이유

FSD(Feature-Sliced Design)의 `features/`, `entities/`, `shared/` 분류는 경계가 모호하다:

```
# FSD의 문제
features/add-item/       ← "기능"인가?
entities/item/            ← "엔티티"인가?
shared/lib/formatKRW      ← item에서만 쓰는데 shared?

# "가격 알림 설정"은 feature인가 entity인가?
# "SKU 선택"은 feature인가 widget인가?
# 매번 이 판단을 해야 한다.
```

**개념(도메인 객체) 기준**이 명확하다:
- `item` → 상품 추적과 관련된 모든 것
- `auth` → 인증과 관련된 모든 것
- `account` → 계정 설정과 관련된 모든 것
- `price` → 가격 표시/계산과 관련된 모든 것

이것은 백엔드에서 `items/`, `auth/`, `user/` 패키지를 나누는 것과 동일한 기준이다.
실제로 API endpoints가 이미 이 구조를 보여준다: `v1/auth/*`, `v1/items/*`, `v1/user/*`.

### 현재 구조 (AS-IS)

```
src/lib/
├── api/
│   ├── auth.ts              # auth API + AuthUser, AuthTokens 타입
│   ├── client.ts            # 범용 fetch wrapper
│   ├── config.ts            # API_BASE, COOKIE_OPTS
│   └── endpoints.ts         # 전체 endpoint 정의
├── components/
│   ├── AddItemModal.svelte   # 123줄
│   ├── AppFooter.svelte      # 36줄
│   ├── AppSidebar.svelte     # 259줄
│   ├── EmptyState.svelte     # 29줄
│   ├── ItemCard.svelte       # 70줄
│   └── PriceChart.svelte     # 378줄
├── data/
│   └── product-dummy.ts      # 1,061줄 더미 데이터
├── stores/
│   └── auth.svelte.ts        # 21줄
├── types.ts                  # TrackedItem, AddItemData (11줄)
└── index.ts                  # 비어있음

src/routes/(app)/
├── home/+page.svelte         # 431줄 - formatKRW 없이 $ 사용
├── items/[id]/+page.svelte   # 539줄 - formatKRW, parseKRW, parseSkus 인라인
├── settings/+page.svelte     # 408줄 - 12개 $state 인라인
├── plan/+page.svelte         # 405줄
└── ...
```

**문제점:**
- 모든 비즈니스 로직이 +page.svelte에 인라인
- 포맷터(formatKRW)가 재사용 불가 (items에만 존재)
- types.ts에 2개 타입만 있고, 나머지 타입은 페이지 내부에 정의
- components/가 flat하게 6개 → 역할 구분 없음
- API 타입(AuthUser)이 api/auth.ts에 같이 있음

### 제안 구조 (TO-BE)

SKILL.md의 개념 단위 분리 원칙은 유지하되, 내부 레이어 깊이를 줄인다.

```
src/lib/
│
├── domain/                         # 개념별 모듈 (핵심)
│   │
│   ├── item/                       # ── 상품 추적 ──
│   │   ├── item.types.ts           #   ItemDetail, ParsedSku, ColorOption, PriceEntry
│   │   ├── item-parser.ts          #   parseSkus (SKU 파싱)
│   │   ├── item-api.ts             #   상품 API 호출 (list, detail, create, delete)
│   │   └── index.ts                #   공개 인터페이스
│   │
│   ├── price/                      # ── 가격 ──
│   │   ├── price-formatter.ts      #   formatKRW, parseKRW, formatPrice
│   │   └── index.ts
│   │
│   ├── auth/                       # ── 인증 ──
│   │   ├── auth.types.ts           #   AuthUser, AuthTokens, LoginRequest
│   │   ├── auth-api.ts             #   login, register, verify, refresh, logout
│   │   ├── auth-store.svelte.ts    #   AuthStore ($state 기반)
│   │   └── index.ts
│   │
│   └── account/                    # ── 계정 설정 ──
│       ├── account.types.ts        #   PasswordChangeRequest, NotificationSettings
│       ├── account-api.ts          #   비밀번호 변경, 알림 설정, 계정 탈퇴 API
│       ├── account-validator.ts    #   비밀번호 validation 규칙
│       └── index.ts
│
├── api/                            # API 인프라 (개념 무관)
│   ├── client.ts                   #   범용 fetch wrapper (apiCall)
│   └── config.ts                   #   API_BASE, COOKIE_OPTS
│
├── components/                     # 공유 UI 컴포넌트
│   ├── AppSidebar.svelte
│   ├── AppFooter.svelte
│   ├── EmptyState.svelte
│   ├── PriceChart.svelte
│   └── LoadingSpinner.svelte       #   반복되는 로딩 SVG 추출
│
├── data/                           # 개발용 더미 (API 연동 후 삭제)
│   └── product-dummy.ts
│
└── index.ts

src/routes/(app)/
├── home/
│   └── +page.svelte               # 대시보드 레이아웃
├── items/
│   └── [id]/
│       ├── +page.svelte            # ~200줄. 데이터 로딩 + 레이아웃 조합
│       ├── SkuSelector.svelte      # 색상/사이즈 선택 (이 라우트 전용)
│       ├── TrackingInfo.svelte     # 마지막 확인, 주기, 알림 토글
│       └── PriceHistoryTable.svelte # 최근 변동 테이블
├── settings/
│   ├── +page.svelte                # ~60줄. 섹션 조합만
│   ├── AccountInfoSection.svelte   # 이메일, 플랜 표시
│   ├── PasswordSection.svelte      # 비밀번호 변경 폼 + 자체 state
│   ├── NotificationSection.svelte  # 알림 토글 + 저장
│   └── DangerZoneSection.svelte    # 계정 탈퇴 + 모달
└── plan/
    └── +page.svelte
```

### 설계 근거

#### domain/ 모듈 분리 기준

```
"이 로직이 2곳 이상에서 쓰이는가?" → domain/으로 분리
"이 로직이 이 페이지에서만 쓰이는가?" → 라우트 폴더에 둔다
```

| 모듈 | 분리 근거 |
|------|----------|
| `domain/price/` | formatKRW는 home, items, plan에서 모두 필요 |
| `domain/item/` | ItemDetail 타입은 items/[id], home, ItemCard에서 사용 |
| `domain/auth/` | auth-api + store + types가 이미 3개 파일 → 개념으로 묶을 가치 |
| `domain/account/` | settings의 validation, API가 인라인 → 분리하면 테스트 가능 |

#### 라우트 전용 컴포넌트 배치

```
# ✅ 라우트 폴더에 두는 것
src/routes/(app)/items/[id]/SkuSelector.svelte
→ items/[id] 페이지에서만 쓰는 컴포넌트

# ✅ lib/components/에 두는 것
src/lib/components/PriceChart.svelte
→ 여러 페이지에서 재사용 가능한 컴포넌트
```

SvelteKit은 라우트 폴더에 `+page.svelte` 외의 `.svelte` 파일을 두면 라우트로 인식하지 않는다.
해당 페이지에서만 쓰는 컴포넌트는 **그 라우트 폴더에 두는 것이 응집도가 가장 높다**.

#### endpoints.ts를 없앤 이유

```typescript
// AS-IS: 모든 endpoint가 한 파일에
export const ENDPOINTS = {
  auth: { login: '...', register: '...' },
  items: { list: '...', detail: (id) => '...' },
  user: { me: '...', password: '...' }
}

// TO-BE: 각 개념의 api 파일이 자기 endpoint를 안다
// domain/item/item-api.ts
const ITEM_ENDPOINTS = {
  list: `${API_BASE}/v1/items`,
  detail: (id: string) => `${API_BASE}/v1/items/${id}`,
} as const;

export async function fetchItemDetail(id: string) { ... }
```

중앙집중 endpoint 파일은 "어디서 이 endpoint를 쓰는가?"를 역추적해야 한다.
각 개념이 자기 endpoint를 가지면 **해당 모듈만 보면 전체 API 사용을 파악할 수 있다**.

#### index.ts 격벽 적용 기준

```
파일이 3개 이상인 모듈 → index.ts 만든다
파일이 1-2개인 모듈 → index.ts 없이 직접 import
```

```typescript
// domain/item/index.ts - 파일이 3개이므로 격벽 적용
export type { ItemDetail, ParsedSku, PriceEntry } from './item.types';
export { parseSkus } from './item-parser';
export { fetchItemDetail, fetchItemList } from './item-api';

// domain/price/index.ts - 파일이 1개이므로 그냥 re-export
export { formatKRW, parseKRW } from './price-formatter';
```

### SKILL.md 구조 vs 제안 구조 비교

| 항목 | SKILL.md | 제안 |
|------|----------|------|
| 개념 단위 분리 | domain/{concept}/ | **동일** |
| 격벽 (index.ts) | 모든 개념에 강제 | 3파일 이상일 때만 |
| 네이밍 컨벤션 | -service, -reader, -writer, -formatter | -api, -formatter, -parser, -validator (필요한 것만) |
| 레이어 깊이 | 4단계 (Presentation→Business→Implement→DataAccess) | 2단계 (Page→Domain+API) |
| service 레이어 | 모든 개념에 필수 | 복잡한 조합 로직 있을 때만 |
| storage/ 분리 | 별도 Data Access 레이어 | api/client.ts에 통합 (현재 규모에 충분) |
| 라우트 전용 컴포넌트 | views/ 폴더에 | 라우트 폴더에 co-locate |

**결론: SKILL.md의 개념 분리 원칙은 올바르다.** 과한 것은 4단계 레이어 강제와 모든 곳의 격벽이다.
"백엔드처럼 모듈 네이밍을 명확하게"라는 방향은 맞다. `-api`, `-formatter`, `-validator`로
파일 역할이 이름에서 바로 보이는 것은 FSD의 `features/auth/model.ts`보다 훨씬 직관적이다.

### 데이터 흐름 (단방향)

```
API Server
  ↓ fetch (domain/{concept}/{concept}-api.ts)
  ↓
Domain Types (domain/{concept}/{concept}.types.ts)
  ↓ import
  ↓
+page.svelte (또는 +page.server.ts의 load)
  ↓ props / $derived
  ↓
Section Components (라우트 전용 .svelte)
  ↓ props (읽기 전용)
  ↓
Shared Components (lib/components/)
```

```
사용자 이벤트
  ↑ onclick / onsubmit
  ↑
Section Component
  ↑ callback prop 또는 직접 호출
  ↑
domain/{concept}/{concept}-api.ts → API Server
```

단방향이 깨지는 패턴을 피한다:
```
❌ 자식 컴포넌트가 직접 API 호출하고 부모 상태를 변경
❌ store를 통해 형제 컴포넌트끼리 암묵적 통신
✅ 부모가 데이터를 내려주고, 자식은 이벤트를 올려준다
```

---

## 8. 요약

| 항목 | 평가 |
|------|------|
| SKILL.md 아키텍처 | 개념 분리 원칙은 올바름. 4단계 레이어 강제가 과함 |
| FSD vs 개념 기반 | 개념(도메인 객체) 기준이 FSD보다 명확. 올바른 판단 |
| items/[id] 539줄 | domain/item/ + 라우트 전용 컴포넌트로 ~200줄 가능 |
| settings 408줄 | 섹션 컴포넌트 4개 분리 → +page.svelte ~60줄 |
| 비즈니스 로직 + UI | "재사용/테스트 필요한 것만 분리", 나머지는 co-locate |
| 네이밍 컨벤션 (-api, -formatter) | 파일 역할이 이름에서 보임. 유지 |
| 데이터 흐름 | Page → Section → Shared 단방향 유지 |
| 전체 방향 | 2단계(Page→Domain)로 시작, 필요 시 service 레이어 추가 |
