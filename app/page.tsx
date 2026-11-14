"use client";

import { useState } from "react";
import Header from "@/components/Header";
import TodoInput, { NewTodoOptions } from "@/components/TodoInput";
import FilterBar from "@/components/FilterBar";
import TodoList from "@/components/TodoList";
import { mockTodos } from "@/lib/mock-data";
import { Filter, SortOrder, Todo } from "@/lib/types";
import { sortTodos, todayString } from "@/lib/utils";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(mockTodos);
  const [filter, setFilter] = useState<Filter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("created");

  const visibleTodos = sortTodos(
    todos.filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    }),
    sortOrder,
  );

  const addTodo = (text: string, { priority, dueDate }: NewTodoOptions) => {
    const newTodo: Todo = {
      id: String(Date.now()),
      text,
      completed: false,
      createdAt: todayString(),
      priority,
      dueDate,
    };
    setTodos([newTodo, ...todos]);
    console.log("할일 추가됨:", text);
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
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
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </>
  );
}
