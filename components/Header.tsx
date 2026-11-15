import { Todo } from "@/lib/types";
import { countRemaining } from "@/lib/utils";

export default function Header({ todos }: { todos: Todo[] }) {
  return (
    <header className="border-b border-rule pb-5 pl-14 pr-4 pt-9">
      <h1 className="font-display text-[1.875rem] font-bold leading-tight tracking-tight text-graphite">
        <span className="marker px-0.5">오늘의 할일</span>
      </h1>
      <p className="mt-2 text-sm text-pencil">
        남은 할일{" "}
        <span className="font-semibold tabular-nums text-ink">
          {countRemaining(todos)}
        </span>
        개
      </p>
    </header>
  );
}
