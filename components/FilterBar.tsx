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
    <div className="flex items-center gap-2 px-4 pb-2">
      {filters.map((f) => {
        const selected = f.value === filter;
        return (
          <button
            key={f.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(f.value)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-all duration-200 active:scale-95 ${
              selected
                ? "border-[#D97757] bg-[#D97757] text-white"
                : "border-gray-200 text-gray-600 hover:border-[#D97757] hover:text-[#D97757]"
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
        className="ml-auto rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-600 outline-none focus:border-[#D97757]"
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
