---
name: Design System Refactor
description: web-ref 기반으로 전체 UI를 zinc/stone 팔레트 + 글래스모피즘으로 리팩토링
type: project
---

2026-03-26에 `web-ref/` 폴더(React + Radix 기반 참조 디자인)를 기준으로 SvelteKit 앱 전체 UI를 리팩토링했다.

## 주요 변경사항

**컬러 팔레트** (layout.css):
- 배경: `#fafaf8` → `#F5F4F1` (따뜻한 오프화이트)
- Primary: `#2d2d2a` → `#1c1917` (stone-900 계열)
- 텍스트: zinc-900/500 클래스 사용으로 전환
- Sage green (`#5aad9c`)은 브랜드 액센트로 유지

**레이아웃 구조**:
- (app)/+layout.svelte에 글래스 sticky 헤더 추가 (hamburger + user avatar)
- 모바일 하단 탭 바 추가 (fixed bottom nav)
- 각 페이지의 per-page 헤더에서 hamburger 제거

**컴포넌트 디자인**:
- AppSidebar: 280px, `bg-[#FCFCFB]`, rounded-2xl nav items, amber "Pro Tip" 카드, gradient 버튼
- ItemCard: `bg-white/60 backdrop-blur-sm border border-zinc-200/60 rounded-3xl`, hover scale image
- AddItemModal: `bg-white/95 backdrop-blur-xl rounded-3xl`, border-2 input, gradient 제출 버튼
- EmptyState: rounded-3xl, gradient CTA 버튼
- AppFooter: zinc-400 텍스트

**버튼 스타일**: `bg-gradient-to-r from-stone-800 to-zinc-800` (web-ref 스타일)

**Why:** 사용자가 web-ref 폴더의 새로운 디자인으로 UI를 완전히 리팩토링 요청
**How to apply:** 새 컴포넌트/페이지 추가 시 위 디자인 패턴 따를 것
