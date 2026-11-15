"use client";

import { Filter, SortOrder } from "@/lib/types";

const filters: { label: string; value: Filter }[] = [
  { label: "전체", value: "all" },
  { label: "진행중", value: "active" },
  { label: "완료", value: "completed" },
];

const sortOptions: { label: string; value: SortOrder }[] = [
  { label: "추가순", value: "created" },
  { label: "마감일순", value: "dueDate" },
  { label: "우선순위순", value: "priority" },
];

interface Props {
  filter: Filter;
  onChange: (filter: Filter) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

export default function FilterBar({
  filter,
  onChange,
  sortOrder,
  onSortChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-2 border-b border-rule pb-2 pl-14 pr-4">
      {/* 고른 필터는 볼펜 밑줄로 표시 */}
      {filters.map((f) => {
        const selected = f.value === filter;
        return (
          <button
            key={f.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(f.value)}
            className={`whitespace-nowrap rounded px-2 py-1 text-sm underline-offset-[6px] transition-colors duration-150 first:-ml-2 ${
              selected
                ? "font-semibold text-ink underline decoration-ink decoration-2"
                : "text-pencil hover:text-graphite"
            }`}
          >
            {f.label}
          </button>
        );
      })}
      <select
        aria-label="정렬"
        value={sortOrder}
        onChange={(e) => {
          const option = sortOptions.find((o) => o.value === e.target.value);
          if (option) onSortChange(option.value);
        }}
        className="ml-auto cursor-pointer rounded border border-transparent bg-transparent py-1 pl-1 pr-0.5 text-xs text-pencil outline-none transition-colors duration-150 hover:border-rule hover:text-graphite"
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
