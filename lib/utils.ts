import { Filter, Priority, SortOrder, Todo } from "@/lib/types";

// "YYYY-MM-DD" 문자열을 "YYYY년 MM월 DD일"로 바꾼다.
// Date로 변환하지 않고 문자열을 그대로 나눠서, 시간대(UTC/로컬) 차이로 날짜가 밀리지 않게 한다.
export function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${year}년 ${month}월 ${day}일`;
}

// 할일 내용의 키워드로 주제에 맞는 이모지를 고른다.
// 위에 있는 규칙이 우선한다. 키워드는 부분 문자열로 비교하므로
// "책"(정책), "약"(요약)처럼 다른 단어 속에 흔히 들어가는 짧은 키워드는 쓰지 않는다.
const emojiRules: { emoji: string; keywords: string[] }[] = [
  {
    emoji: "💳",
    keywords: ["결제", "송금", "이체", "카드값", "청구서", "납부"],
  },
  {
    emoji: "📚",
    keywords: ["강의", "공부", "책 읽", "독서", "시험", "학습", "수업", "과제"],
  },
  {
    emoji: "💻",
    keywords: ["코드", "코딩", "개발", "배포", "버그", "프로그램"],
  },
  { emoji: "🛒", keywords: ["장보기", "장 보기", "마트", "구매", "쇼핑"] },
  { emoji: "🏃", keywords: ["운동", "헬스", "러닝", "달리기", "산책", "요가"] },
  {
    emoji: "🍽️",
    keywords: ["밥 먹", "식사", "점심", "저녁", "아침", "요리"],
  },
  {
    emoji: "🧹",
    keywords: ["청소", "빨래", "설거지", "정리", "분리수거"],
  },
  { emoji: "📅", keywords: ["회의", "미팅", "약속", "일정", "예약"] },
  { emoji: "📞", keywords: ["전화", "연락", "문자 보내", "문자하기"] },
  { emoji: "✉️", keywords: ["메일", "답장"] },
  {
    emoji: "🏥",
    keywords: ["병원", "약국", "약 먹", "약 타", "진료", "치과"],
  },
  { emoji: "✈️", keywords: ["여행", "비행기", "출장"] },
];

export function getTodoEmoji(text: string) {
  const rule = emojiRules.find((r) =>
    r.keywords.some((keyword) => text.includes(keyword)),
  );
  return rule ? rule.emoji : "📝";
}

// 높은 순서. 선택 버튼 순서와 정렬 기준으로 함께 쓴다.
export const priorities: Priority[] = ["high", "medium", "low"];

export const priorityLabels: Record<Priority, string> = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

// 우선순위별 Tailwind 색상 (테두리/배경/글자)
export const priorityStyles: Record<Priority, string> = {
  high: "border-red-400 bg-red-50 text-red-600",
  medium: "border-amber-400 bg-amber-50 text-amber-600",
  low: "border-sky-400 bg-sky-50 text-sky-600",
};

function priorityRank(priority: Priority) {
  return priorities.indexOf(priority);
}

// 오늘 날짜를 로컬 시간 기준 YYYY-MM-DD 문자열로 반환
export function todayString() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function filterTodos(todos: Todo[], filter: Filter) {
  if (filter === "active") return todos.filter((todo) => !todo.completed);
  if (filter === "completed") return todos.filter((todo) => todo.completed);
  return todos;
}

// 마감일 빠른 순. 마감일 없는 할일은 맨 뒤, 같은 날이면 우선순위 높은 순.
function compareDueDate(a: Todo, b: Todo) {
  if (a.dueDate !== b.dueDate) {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate < b.dueDate ? -1 : 1;
  }
  return priorityRank(a.priority) - priorityRank(b.priority);
}

// 우선순위 높은 순, 같으면 마감일 빠른 순.
function comparePriority(a: Todo, b: Todo) {
  const diff = priorityRank(a.priority) - priorityRank(b.priority);
  return diff !== 0 ? diff : compareDueDate(a, b);
}

// "created"는 추가된 순서(최신이 위) 그대로 둔다. 원본 배열은 바꾸지 않는다.
export function sortTodos(todos: Todo[], order: SortOrder) {
  if (order === "dueDate") return [...todos].sort(compareDueDate);
  if (order === "priority") return [...todos].sort(comparePriority);
  return todos;
}

export function countRemaining(todos: Todo[]) {
  return todos.filter((todo) => !todo.completed).length;
}
