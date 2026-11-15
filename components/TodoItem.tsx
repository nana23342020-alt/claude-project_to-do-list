"use client";

import { Todo } from "@/lib/types";
import {
  formatDate,
  getTodoEmoji,
  priorityLabels,
  priorityStyles,
} from "@/lib/utils";
import { useToday } from "@/lib/useToday";
import Checkbox from "./Checkbox";

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

// 미완료 할일의 마감일이 지났거나 오늘이면 강조 라벨과 색을 돌려준다.
// "오늘"은 형광펜, "지남"은 빨간펜으로 표시한다.
function getDueStatus(todo: Todo, today: string | null) {
  if (!todo.dueDate || todo.completed || !today) return null;
  if (todo.dueDate < today) {
    return { label: "지남", className: "font-semibold text-pen-red" };
  }
  if (todo.dueDate === today) {
    return { label: "오늘", className: "marker font-semibold text-graphite" };
  }
  return null;
}

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  const today = useToday();
  const dueStatus = getDueStatus(todo, today);

  return (
    <li className="group grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-start border-b border-rule pr-2 transition-colors duration-150 hover:bg-ink-soft/40">
      {/* 체크박스는 빨간 여백선 왼쪽 칸에 둔다 */}
      <div className="flex justify-center pt-[1.0625rem]">
        <Checkbox
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          label={todo.text}
        />
      </div>
      <div className="py-3.5 pl-3">
        <p
          className={`break-words leading-relaxed transition-colors duration-150 ${
            todo.completed
              ? "text-pencil line-through decoration-ink/70 decoration-[1.5px]"
              : "text-graphite"
          }`}
        >
          <span className="mr-1.5" aria-hidden>
            {getTodoEmoji(todo.text)}
          </span>
          {todo.text}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-pencil">
          <span
            className={`rounded-sm border px-1.5 leading-[1.125rem] ${
              todo.completed
                ? "border-rule text-pencil"
                : priorityStyles[todo.priority]
            }`}
          >
            {priorityLabels[todo.priority]}
          </span>
          {todo.dueDate && (
            <span className="tabular-nums">
              마감 {formatDate(todo.dueDate)}
              {dueStatus && (
                <span className={`ml-1.5 px-0.5 ${dueStatus.className}`}>
                  {dueStatus.label}
                </span>
              )}
            </span>
          )}
          <span className="tabular-nums">
            추가 {formatDate(todo.createdAt)}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label={`${todo.text} 삭제`}
        className="mt-3 shrink-0 rounded px-2 py-1 text-[0.8125rem] text-pencil transition-colors duration-150 hover:bg-pen-red/[0.06] hover:text-pen-red"
      >
        삭제
      </button>
    </li>
  );
}
