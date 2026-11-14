import { Priority, SortOrder, Todo } from "@/lib/types";

// 날짜 문자열을 보기 좋게 바꿔주는 함수
export function fd(d: string) {
  let result = "";
  const x = new Date(d);
  const y = x.getFullYear();
  let m = x.getMonth() + 1;
  let dd = x.getDate();
  if (m < 10) {
    result = result + y + "년 " + "0" + m + "월 ";
  } else {
    result = result + y + "년 " + m + "월 ";
  }
  if (dd < 10) {
    result = result + "0" + dd + "일";
  } else {
    result = result + dd + "일";
  }
  return result;
}

// 할일 내용의 키워드로 주제에 맞는 이모지를 고른다. 위에 있는 규칙이 우선.
const emojiRules: { emoji: string; keywords: string[] }[] = [
  { emoji: "💳", keywords: ["결제", "송금", "이체", "카드", "청구", "납부"] },
  { emoji: "📚", keywords: ["강의", "공부", "책", "독서", "시험", "학습", "수업", "과제"] },
  { emoji: "💻", keywords: ["코드", "코딩", "개발", "배포", "버그", "프로그램"] },
  { emoji: "🛒", keywords: ["장보기", "마트", "구매", "쇼핑", "사기"] },
  { emoji: "🏃", keywords: ["운동", "헬스", "러닝", "달리기", "산책", "요가"] },
  { emoji: "🍽️", keywords: ["밥", "식사", "점심", "저녁", "아침", "요리"] },
  { emoji: "🧹", keywords: ["청소", "빨래", "설거지", "정리", "분리수거"] },
  { emoji: "📅", keywords: ["회의", "미팅", "약속", "일정", "예약"] },
  { emoji: "📞", keywords: ["전화", "연락", "문자"] },
  { emoji: "✉️", keywords: ["메일", "이메일", "답장"] },
  { emoji: "🏥", keywords: ["병원", "약", "진료", "치과"] },
  { emoji: "✈️", keywords: ["여행", "비행기", "출장"] },
];

export function getTodoEmoji(text: string) {
  const rule = emojiRules.find((r) => r.keywords.some((k) => text.includes(k)));
  return rule ? rule.emoji : "📝";
}

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

const priorityRank:Record<Priority, number> = { high: 0, medium: 1, low: 2 };

// 오늘 날짜를 로컬 시간 기준 YYYY-MM-DD 문자열로 반환
export function todayString() {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
}

// 마감일 빠른 순. 마감일 없는 할일은 맨 뒤, 같은 날이면 우선순위 높은 순.
function compareDueDate(a: Todo, b: Todo) {
  if (a.dueDate !== b.dueDate) {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate < b.dueDate ? -1 : 1;
  }
  return priorityRank[a.priority] - priorityRank[b.priority];
}

// 우선순위 높은 순, 같으면 마감일 빠른 순.
function comparePriority(a: Todo, b: Todo) {
  const diff = priorityRank[a.priority] - priorityRank[b.priority];
  return diff !== 0 ? diff : compareDueDate(a, b);
}

// "created"는 추가된 순서(최신이 위) 그대로 둔다.
export function sortTodos(todos: Todo[], order: SortOrder) {
  if (order === "dueDate") return [...todos].sort(compareDueDate);
  if (order === "priority") return [...todos].sort(comparePriority);
  return todos;
}

export function countRemaining(todos: Todo[]) {
  return todos.filter((t) => !t.completed).length;
}
