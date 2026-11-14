# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

"미니 할일" — Next.js 16 (App Router) + React 19 + Tailwind CSS v4로 만든 단일 페이지 할일(Todo) 앱. 클로드 코드 강의용 스타터 프로젝트이며, UI 문구와 주석은 모두 한국어다.

## 명령어

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (http://localhost:3000)
npm run build        # 프로덕션 빌드 (타입 체크 포함)
npm run lint         # ESLint (eslint-config-next core-web-vitals + typescript)
npx prettier --write .   # 포맷 (.prettierrc: 세미콜론, 큰따옴표, trailingComma all, 80자)
```

테스트 프레임워크는 설정되어 있지 않다.

## 아키텍처

- **상태는 `app/page.tsx` 한 곳에만 있다.** `Home`(client component)이 `useState<Todo[]>`로 할일 목록을, `useState<Filter>`로 현재 필터를, `useState<SortOrder>`로 정렬 방식을 보유한다. 필터 후 `sortTodos()`로 정렬한 `visibleTodos`를 `TodoList`에 넘기고, `Header`에는 전체 `todos`를 넘긴다. 또한 `addTodo` / `toggleTodo` / `deleteTodo` 핸들러를 props로 하위 컴포넌트에 내려준다. 전역 상태 관리 라이브러리, API, DB, 영속화(localStorage 등)는 없다 — 초기값은 `lib/mock-data.ts`의 `mockTodos`이고 새로고침하면 초기화된다.
- 컴포넌트 흐름: `Header`(남은 개수) → `TodoInput`(추가) → `FilterBar`(필터 버튼 + 정렬 select) → `TodoList` → `TodoItem` → `Checkbox`.
- `lib/types.ts`: `Todo`(`id`, `text`, `completed`, `createdAt`, `priority`, 선택적 `dueDate` — 날짜는 모두 `YYYY-MM-DD` 문자열이라 문자열 비교로 정렬/비교한다), `Priority`(`"high" | "medium" | "low"`), `Filter`, `SortOrder`(`"created" | "dueDate" | "priority"`).
- 정렬(`sortTodos`): `created`는 배열 순서 그대로(새 할일이 맨 위), `dueDate`는 마감일 빠른 순·마감일 없으면 맨 뒤·동률이면 우선순위, `priority`는 높음→낮음·동률이면 마감일. 우선순위 라벨/색상은 `priorityLabels`/`priorityStyles`에 모여 있고 `TodoInput`과 `TodoItem`이 공유한다. 날짜 "오늘"은 `todayString()`(로컬 시간 기준)을 쓴다 — `toISOString()`은 UTC라 쓰지 않는다.
- `lib/utils.ts`: `fd()`(날짜를 `YYYY년 MM월 DD일`로 포맷), `countRemaining()`(미완료 개수), `getTodoEmoji()`(`emojiRules` 키워드 매칭으로 할일 앞 이모지 결정, 없으면 📝 — 데이터에 저장하지 않고 `TodoItem`에서 표시할 때만 붙인다).
- `TodoInput`은 입력을 `trim()`하고, 비어 있으면 추가하지 않고 입력창 아래에 오류 메시지를 띄운다. Enter 처리 시 `isComposing`을 확인해 한글 IME 중복 입력을 막는다.
- `app/layout.tsx`가 모바일 폭(`max-w-md`) 컨테이너를 제공하고 `lang="ko"`로 설정한다.
- 경로 별칭 `@/*` → 프로젝트 루트.
- 스타일은 Tailwind 유틸리티 클래스로만 작성하며, 포인트 컬러는 `#D97757`(hover `#c96647`)를 arbitrary value로 직접 쓴다. `globals.css`는 `@import "tailwindcss"`만 있다 (tailwind.config 파일 없음, v4 방식).

## 현재 미완성/알려진 상태

강의 실습용으로 의도적으로 남겨진 부분이 있으니, 수정 요청 시 참고:

- `addTodo`에 `console.log`가 남아 있다.
- `fd()`는 변수명이 축약되어 있고 문자열 이어붙이기로 구현되어 있다 (리팩터링 대상).
