"use client";

import { useSyncExternalStore } from "react";
import { mockTodos } from "@/lib/mock-data";
import { Priority, Todo } from "@/lib/types";
import { priorities } from "@/lib/utils";

// 할일 목록을 브라우저 localStorage에 저장해 새로고침해도 유지한다.
// 저장된 값이 없으면(처음 방문) 샘플 할일(mockTodos)로 시작한다.
const STORAGE_KEY = "mini-todo:todos";

let cache: Todo[] | null = null;
const listeners = new Set<() => void>();

// 저장된 값이 손상됐거나 예전 형식이어도 앱이 깨지지 않게 정리한다.
function normalize(value: unknown): Todo[] | null {
  if (!Array.isArray(value)) return null;
  return value
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.text === "string",
    )
    .map((item) => ({
      id: item.id as string,
      text: item.text as string,
      completed: item.completed === true,
      createdAt: typeof item.createdAt === "string" ? item.createdAt : "",
      priority: priorities.includes(item.priority as Priority)
        ? (item.priority as Priority)
        : "medium",
      dueDate: typeof item.dueDate === "string" ? item.dueDate : undefined,
    }));
}

function load(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return mockTodos;
    return normalize(JSON.parse(raw)) ?? mockTodos;
  } catch {
    // 저장소 접근이 막혔거나(시크릿 모드 등) JSON이 깨진 경우
    return mockTodos;
  }
}

function save(todos: Todo[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // 저장에 실패해도 화면의 목록은 그대로 동작하게 둔다.
  }
}

function getSnapshot() {
  if (cache === null) cache = load();
  return cache;
}

// 서버 렌더링에는 localStorage가 없으므로 "아직 모름"(null)으로 그린다.
function getServerSnapshot() {
  return null;
}

function notify() {
  listeners.forEach((listener) => listener());
}

// 다른 탭에서 목록을 바꾸면 이 탭에도 반영한다.
function handleStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  cache = null;
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

export function setTodos(update: (prev: Todo[]) => Todo[]) {
  cache = update(getSnapshot());
  save(cache);
  notify();
}

// 저장된 할일 목록. 서버 렌더링과 hydration 중에는 null이다.
export function useTodos(): Todo[] | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
