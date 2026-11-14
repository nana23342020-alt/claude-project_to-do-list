"use client";

import { useState } from "react";
import Header from "@/components/Header";
import TodoInput from "@/components/TodoInput";
import FilterBar from "@/components/FilterBar";
import TodoList from "@/components/TodoList";
import { mockTodos } from "@/lib/mock-data";
import { Filter, NewTodoOptions, SortOrder, Todo } from "@/lib/types";
import { filterTodos, sortTodos, todayString } from "@/lib/utils";

const emptyMessages: Record<Filter, string> = {
  all: "아직 할일이 없어요. 위에서 새 할일을 추가해 보세요.",
  active: "진행중인 할일이 없어요. 모두 끝냈어요! 🎉",
  completed: "아직 완료한 할일이 없어요.",
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(mockTodos);
  const [filter, setFilter] = useState<Filter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("created");

  const visibleTodos = sortTodos(filterTodos(todos, filter), sortOrder);

  const addTodo = (text: string, { priority, dueDate }: NewTodoOptions) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: todayString(),
      priority,
      dueDate,
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <>
      <Header todos={todos} />
      <TodoInput onAdd={addTodo} />
      <FilterBar
        filter={filter}
        onChange={setFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />
      <TodoList
        todos={visibleTodos}
        emptyMessage={emptyMessages[filter]}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </>
  );
}
