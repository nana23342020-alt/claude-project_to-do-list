"use client";

import { useState } from "react";
import { Priority } from "@/lib/types";
import { priorityLabels, priorityStyles, todayString } from "@/lib/utils";

export interface NewTodoOptions {
  priority: Priority;
  dueDate?: string;
}

const priorities: Priority[] = ["high", "medium", "low"];

interface Props {
  onAdd: (text: string, options: NewTodoOptions) => void;
}

export default function TodoInput({ onAdd }: Props) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError(
        text.length > 0
          ? "공백만으로는 할일을 추가할 수 없어요. 내용을 입력해 주세요."
          : "할일 내용을 입력한 뒤 추가해 주세요.",
      );
      return;
    }
    onAdd(trimmed, { priority, dueDate: dueDate || undefined });
    setText("");
    setError("");
    setPriority("medium");
    setDueDate("");
  };

  return (
    <div className="p-4">
      <div className="flex gap-2">
        <input
          className={`flex-1 rounded-lg border bg-gray-50 px-4 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:bg-white focus:ring-2 ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-gray-200 focus:border-[#D97757] focus:ring-[#D97757]/20"
          }`}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError("");
          }}
          placeholder="할일을 입력하세요"
          aria-invalid={!!error}
          aria-describedby={error ? "todo-input-error" : undefined}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.nativeEvent.isComposing && handleAdd()
          }
        />
        <button
          onClick={handleAdd}
          className="rounded-lg bg-[#D97757] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#c96647] active:scale-95"
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
          {error}
        </p>
      )}
      <div className="mt-2 flex items-center justify-between gap-2">
        <div
          role="radiogroup"
          aria-label="우선순위"
          className="flex items-center gap-1"
        >
          <span className="mr-1 text-xs text-gray-500">우선순위</span>
          {priorities.map((p) => {
            const selected = p === priority;
            return (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={selected}
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
        <label className="flex items-center gap-1 text-xs text-gray-500">
          마감일
          <input
            type="date"
            value={dueDate}
            min={todayString()}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-md border border-gray-200 px-1.5 py-0.5 text-xs text-gray-600 outline-none focus:border-[#D97757]"
          />
        </label>
      </div>
    </div>
  );
}
