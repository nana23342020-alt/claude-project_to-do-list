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
function getDueStatus(todo: Todo, today: string | null) {
  if (!todo.dueDate || todo.completed || !today) return null;
  if (todo.dueDate < today) {
    return { label: "지남", className: "font-medium text-red-500" };
  }
  if (todo.dueDate === today) {
    return { label: "오늘", className: "font-medium text-[#D97757]" };
  }
  return null;
}

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  const today = useToday();
  const dueStatus = getDueStatus(todo, today);

  return (
    <li className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 transition-colors duration-200 hover:bg-orange-50/40">
      <Checkbox
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        label={todo.text}
      />
      <div className="min-w-0 flex-1">
        <p
          className={`break-words transition-colors duration-200 ${
            todo.completed ? "text-gray-400 line-through" : "text-gray-800"
          }`}
        >
          <span className="mr-1.5" aria-hidden>
            {getTodoEmoji(todo.text)}
          </span>
          {todo.text}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-400">
          <span
            className={`rounded border px-1.5 leading-4 ${
              todo.completed
                ? "border-gray-200 text-gray-400"
                : priorityStyles[todo.priority]
            }`}
          >
            {priorityLabels[todo.priority]}
          </span>
          {todo.dueDate && (
            <span className={dueStatus?.className}>
              마감 {formatDate(todo.dueDate)}
              {dueStatus && ` · ${dueStatus.label}`}
            </span>
          )}
          <span>추가 {formatDate(todo.createdAt)}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label={`${todo.text} 삭제`}
        className="shrink-0 rounded-md px-2 py-1 text-sm text-gray-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-500"
      >
        삭제
      </button>
    </li>
  );
}
