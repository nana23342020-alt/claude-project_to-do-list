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
    <div className="pb-4 pl-14 pr-4 pt-5">
      <div className="flex items-end gap-3">
        {/* 노트 줄 위에 적는 느낌: 상자 대신 밑줄 하나 */}
        <input
          className={`min-w-0 flex-1 border-b-2 bg-transparent pb-1.5 pt-1 text-base text-graphite outline-none transition-colors duration-150 placeholder:text-pencil/70 focus-visible:outline-none ${
            textInvalid
              ? "border-pen-red"
              : "border-rule hover:border-ink/40 focus:border-ink"
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
          className="shrink-0 whitespace-nowrap rounded-md bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors duration-150 hover:bg-ink-deep active:translate-y-px"
        >
          추가
        </button>
      </div>
      {error && (
        <p
          id="todo-input-error"
          role="alert"
          className="mt-2 flex items-center gap-1 text-[0.8125rem] text-pen-red"
        >
          <span aria-hidden>⚠️</span>
          {error.message}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div
          role="group"
          aria-labelledby="priority-label"
          className="flex items-center gap-1 whitespace-nowrap"
        >
          <span id="priority-label" className="mr-1.5 text-xs text-pencil">
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
                className={`rounded border px-2 py-0.5 text-xs transition-colors duration-150 ${
                  selected
                    ? `${priorityStyles[p]} font-medium`
                    : "border-transparent text-pencil hover:text-graphite"
                }`}
              >
                {priorityLabels[p]}
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-1.5 whitespace-nowrap text-xs text-pencil">
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
            className={`rounded border bg-paper px-1.5 py-0.5 text-xs text-graphite outline-none transition-colors duration-150 ${
              dueDateInvalid
                ? "border-pen-red"
                : "border-rule hover:border-ink/40 focus:border-ink"
            }`}
          />
        </label>
      </div>
    </div>
  );
}
