# Price Eye (gugu-plus) 프로젝트 규칙

## 데이터 페칭

- 페이지 데이터는 반드시 `+page.ts` 또는 `+page.server.ts`의 `load` 함수에서 fetch한다.
- 컴포넌트(`.svelte`, `.svelte.ts`)에서 `apiGet`, `apiPost`, `fetch()` 등으로 직접 초기 데이터를 가져오지 않는다.
- 데이터 갱신(추가/삭제 후 목록 리프레시)은 `invalidate(url)`을 사용한다.
- 클라이언트 전용 추가 로딩(infinite scroll 등)은 예외로 허용하되, 첫 페이지 데이터는 반드시 `load`에서 가져온다.

## Svelte 5 패턴

- 페이지 로직은 `createXxxPage()` 팩토리 함수로 분리한다 (`.svelte.ts` 파일).
- `$state`는 팩토리 함수 내부에서만 선언한다. 모듈 최상위에 `$state`를 두지 않는다 (SSR 상태 오염 방지).
- `load` 데이터는 `getData: () => T` 패턴으로 팩토리에 전달하여 반응성을 유지한다.

## API / BFF

- 브라우저 → BFF 프록시(`/api/v1/...`) → 백엔드 구조를 유지한다.
- BFF 서버 라우트는 `src/routes/api/v1/` 하위에 둔다.
- 클라이언트 API 타입과 함수는 `src/lib/api/` 하위에 둔다.
- 읽기 전용 BFF 응답에는 적절한 `Cache-Control` 헤더를 설정한다.
