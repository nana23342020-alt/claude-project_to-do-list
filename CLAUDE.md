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

- **할일 목록은 `lib/todoStore.ts`가 localStorage(`mini-todo:todos` 키)에 저장한다.** `useTodos()`(`useSyncExternalStore` 기반)로 읽고 `setTodos((prev) => ...)`로 바꾸면 저장과 리렌더가 함께 일어난다. 서버 렌더링/hydration 중에는 `useTodos()`가 `null`이라 "불러오는 중"을 보여 준다(hydration 불일치 방지). 저장값이 없으면 `lib/mock-data.ts`의 `mockTodos`로 시작하고, 저장값은 `normalize()`로 검증해 예전 형식(예: `priority` 없음)도 받아들인다. 다른 탭의 변경은 `storage` 이벤트로 반영된다. `Todo` 필드를 바꾸면 `normalize()`도 함께 고친다. API·DB는 없다.
- 화면 상태는 `app/page.tsx`에 있다. `Home`(client component)이 `useState<Filter>`로 현재 필터를, `useState<SortOrder>`로 정렬 방식을 보유한다. 필터 후 `sortTodos()`로 정렬한 `visibleTodos`를 `TodoList`에 넘기고, `Header`에는 전체 `todos`를 넘긴다. 또한 `addTodo` / `toggleTodo` / `deleteTodo` 핸들러를 props로 하위 컴포넌트에 내려준다. 필터와 정렬 선택은 저장하지 않는다.
- 컴포넌트 흐름: `Header`(남은 개수) → `TodoInput`(추가) → `FilterBar`(필터 버튼 + 정렬 select) → `TodoList` → `TodoItem` → `Checkbox`.
- `lib/types.ts`: `Todo`(`id`, `text`, `completed`, `createdAt`, `priority`, 선택적 `dueDate` — 날짜는 모두 `YYYY-MM-DD` 문자열이라 문자열 비교로 정렬/비교한다), `Priority`(`"high" | "medium" | "low"`), `Filter`, `SortOrder`(`"created" | "dueDate" | "priority"`).
- 정렬(`sortTodos`): `created`는 배열 순서 그대로(새 할일이 맨 위), `dueDate`는 마감일 빠른 순·마감일 없으면 맨 뒤·동률이면 우선순위, `priority`는 높음→낮음·동률이면 마감일. 우선순위 라벨/색상은 `priorityLabels`/`priorityStyles`에 모여 있고 `TodoInput`과 `TodoItem`이 공유한다. 
- **날짜 규칙:** 날짜 문자열을 `new Date()`로 파싱하지 않는다(UTC로 해석돼 시간대에 따라 하루 밀린다). 표시는 `formatDate()`가 문자열을 나눠서 하고, "오늘"은 `todayString()`(로컬 시간)으로 만든다. `toISOString()`은 쓰지 않는다. 컴포넌트 렌더 중에 오늘 날짜가 필요하면 `lib/useToday.ts`의 `useToday()`를 쓴다 — 서버 렌더링에서는 `null`이라 hydration 불일치가 없고, 1분마다 다시 확인해 자정이 지나도 갱신된다.
- `lib/utils.ts`: `formatDate()`, `filterTodos()`, `sortTodos()`, `countRemaining()`(미완료 개수), `getTodoEmoji()`(`emojiRules` 키워드 부분 문자열 매칭, 없으면 📝 — 데이터에 저장하지 않고 `TodoItem`에서 표시할 때만 붙인다. 다른 단어 속에 흔히 들어가는 한 글자 키워드는 오탐을 내므로 쓰지 않는다), `priorities`(높은 순, 정렬 기준 겸 버튼 순서).
- 새 할일 id는 `crypto.randomUUID()`.
- `TodoInput`은 입력을 `trim()`하고, 빈 값이거나 마감일이 오늘 이전이면 추가하지 않고 입력창 아래에 오류 메시지를 띄운다(어느 칸의 오류인지 `error.field`로 구분). 할일은 최대 100자. Enter 처리 시 `isComposing`을 확인해 한글 IME 중복 입력을 막는다.
- 접근성: 아이콘/중복 이름 버튼에는 `aria-label`을 단다(체크박스는 할일 내용, 삭제는 "<할일> 삭제"). 토글 버튼 묶음(필터, 우선순위)은 `aria-pressed`로 통일한다.
- `app/layout.tsx`가 모바일 폭(`max-w-md`) 컨테이너를 제공하고 `lang="ko"`로 설정한다.
- 경로 별칭 `@/*` → 프로젝트 루트.
- `next.config.ts`에서 `turbopack.root`를 이 앱 폴더로 고정한다. 상위 `claude-project` 폴더에도 `package-lock.json`이 있어서, 고정하지 않으면 Next.js가 상위 폴더를 루트로 잡아 "React Client Manifest" 500 오류가 난다.

## 디자인 시스템 ("노트에 파란 볼펜으로 적는 하루 메모")

- 색·글꼴 토큰은 `app/globals.css`의 `@theme`에 모여 있다(Tailwind v4, tailwind.config 없음). 색은 hex를 직접 쓰지 말고 토큰 클래스(`bg-paper`, `text-ink`, `border-rule`, `text-pencil`, `text-pen-red` 등)를 쓴다. Tailwind 기본 회색/빨강(`gray-*`, `red-*`)도 쓰지 않는다.
- 색의 역할: `ink`(파란 볼펜) = 주요 동작·선택·포커스·체크, `pen-red`(빨간펜) = 높은 우선순위·오류·지난 마감, `pencil` = 보조 글자, `rule` = 줄/구분선, `margin` = 왼쪽 빨간 여백선, `marker`(형광펜) = **"오늘"에만** 쓴다(제목 "오늘의 할일", 마감 "오늘" 표시). 형광펜은 `.marker` 클래스.
- 글꼴: 제목은 `font-display`(Gowun Batang), 나머지는 기본 `font-sans`(IBM Plex Sans KR). `layout.tsx`에서 `next/font/google`로 불러오며 한글이라 `preload: false`.
- 레이아웃: 시트 왼쪽 44px(`left-11`)에 빨간 여백선이 있고, 본문은 그 오른쪽(`pl-14`)에서 시작한다. 할일 행은 `grid-cols-[2.75rem_…]`로 체크박스를 여백선 왼쪽 칸에 둔다. 새 영역을 추가할 때도 `pl-14 pr-4`에 맞춘다.
- 이전 포인트 컬러 `#D97757`(주황)은 쓰지 않는다 — Claude 화면 색과 같아 앱 고유의 색으로 보이지 않는다.
