"use client";

interface Props {
  checked: boolean;
  onChange: () => void;
  // 화면 읽기 프로그램이 읽을 이름 (예: 할일 내용)
  label: string;
}

export default function Checkbox({ checked, onChange, label }: Props) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-[3px] border-[1.5px] transition-colors duration-150 ${
        checked
          ? "border-ink bg-ink"
          : "border-pencil/70 bg-paper hover:border-ink"
      }`}
    >
      {checked && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="check-draw h-3 w-3 text-paper"
          aria-hidden
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  );
}
