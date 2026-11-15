"use client";

import { Todo } from "@/lib/types";
import TodoItem from "@/components/TodoItem";

interface Props {
  todos: Todo[];
  // 목록이 비었을 때 보여줄 안내 문구
  emptyMessage: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({
  todos,
  emptyMessage,
  onToggle,
  onDelete,
}: Props) {
  if (todos.length === 0) {
    return (
      <p className="py-14 pl-14 pr-4 text-sm leading-relaxed text-pencil">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
