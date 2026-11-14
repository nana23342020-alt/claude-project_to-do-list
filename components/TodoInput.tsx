"use client";

import { useState } from "react";
import { NewTodoOptions, Priority } from "@/lib/types";
import { priorities, priorityLabels, priorityStyles } from "@/lib/utils";
import { useToday } from "@/lib/useToday";

const MAX_LENGTH = 100;

type InputError = { field: "text" | "dueDate"; message: string } | null;

interface Props {
  onAdd: (text: string, options: NewTodoOptions) => void;
}

export default function TodoInput({ onAdd }: Props) {
  const today = useToday();
  const [text, setText] = useState("");
  const [error, setError] = useState<InputError>(null);
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError({
        field: "text",
        message:
          text.length > 0
            ? "공백만으로는 할일을 추가할 수 없어요. 내용을 입력해 주세요."
            : "할일 내용을 입력한 뒤 추가해 주세요.",
      });
      return;
    }
    // date input의 min은 달력 선택만 막으므로, 직접 입력한 지난 날짜도 여기서 막는다.
    if (dueDate && today && dueDate < today) {
      setError({
        field: "dueDate",
        message: "마감일은 오늘 이후 날짜로 골라 주세요.",
      });
      return;
    }
    onAdd(trimmed, { priority, dueDate: dueDate || undefined });
    setText("");
    setError(null);
    setPriority("medium");
    setDueDate("");
  };

  const textInvalid = error?.field === "text";
  const dueDateInvalid = error?.field === "dueDate";

  return (
    <div className="p-4">
      <div className="flex gap-2">
        <input
          className={`min-w-0 flex-1 rounded-lg border bg-gray-50 px-4 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:bg-white focus:ring-2 ${
            textInvalid
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-gray-200 focus:border-[#D97757] focus:ring-[#D97757]/20"
          }`}
          value={text}
          maxLength={MAX_LENGTH}
          onChange={(e) => {
            setText(e.target.value);
            if (textInvalid) setError(null);
          }}
          placeholder="할일을 입력하세요"
          aria-label="할일 내용"
          aria-invalid={textInvalid}
          aria-describedby={textInvalid ? "todo-input-error" : undefined}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.nativeEvent.isComposing && handleAdd()
          }
        />
        <button
          type="button"
          onClick={handleAdd}
          className="shrink-0 whitespace-nowrap rounded-lg bg-[#D97757] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#c96647] active:scale-95"
        >
          추가
        </button>
      </div>
      {error && (
        <p
          id="todo-input-error"
          role="alert"
          className="mt-2 flex items-center gap-1 text-xs text-red-500"
        >
          <span aria-hidden>⚠️</span>
          {error.message}
        </p>
      )}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <div
          role="group"
          aria-labelledby="priority-label"
          className="flex items-center gap-1 whitespace-nowrap"
        >
          <span id="priority-label" className="mr-1 text-xs text-gray-500">
            우선순위
          </span>
          {priorities.map((p) => {
            const selected = p === priority;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={selected}
                onClick={() => setPriority(p)}
                className={`rounded-md border px-2 py-0.5 text-xs transition-colors duration-200 ${
                  selected
                    ? priorityStyles[p]
                    : "border-gray-200 text-gray-400 hover:text-gray-600"
                }`}
              >
                {priorityLabels[p]}
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-1 whitespace-nowrap text-xs text-gray-500">
          마감일
          <input
            type="date"
            value={dueDate}
            min={today ?? undefined}
            onChange={(e) => {
              setDueDate(e.target.value);
              if (dueDateInvalid) setError(null);
            }}
            aria-invalid={dueDateInvalid}
            aria-describedby={dueDateInvalid ? "todo-input-error" : undefined}
            className={`rounded-md border px-1.5 py-0.5 text-xs text-gray-600 outline-none ${
              dueDateInvalid
                ? "border-red-300 focus:border-red-400"
                : "border-gray-200 focus:border-[#D97757]"
            }`}
          />
        </label>
      </div>
    </div>
  );
}
