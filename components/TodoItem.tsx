"use client";

import { Todo } from "@/lib/types";
import {
  fd,
  getTodoEmoji,
  priorityLabels,
  priorityStyles,
  todayString,
} from "@/lib/utils";
import Checkbox from "./Checkbox";

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  // 미완료 할일의 마감일이 지났거나 오늘이면 강조한다.
  const today = todayString();
  let dueLabel = "";
  let dueClass = "";
  if (todo.dueDate && !todo.completed) {
    if (todo.dueDate < today) {
      dueLabel = "지남";
      dueClass = "font-medium text-red-500";
    } else if (todo.dueDate === today) {
      dueLabel = "오늘";
      dueClass = "font-medium text-[#D97757]";
    }
  }

  return (
    <li className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 transition-colors duration-200 hover:bg-orange-50/40">
      <Checkbox checked={todo.completed} onChange={() => onToggle(todo.id)} />
      <div className="flex-1">
        <p
          className={`transition-colors duration-200 ${
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
            <span className={dueClass}>
              마감 {fd(todo.dueDate)}
              {dueLabel && ` · ${dueLabel}`}
            </span>
          )}
          <span>추가 {fd(todo.createdAt)}</span>
        </div>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="rounded-md px-2 py-1 text-sm text-gray-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-500"
      >
        삭제
      </button>
    </li>
  );
}
