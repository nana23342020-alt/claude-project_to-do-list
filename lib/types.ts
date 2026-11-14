export type Priority = "high" | "medium" | "low";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  priority: Priority;
  // 마감일 (YYYY-MM-DD). 마감일이 없는 할일은 undefined.
  dueDate?: string;
}

// 할일 추가 시 입력창에서 함께 고르는 값
export interface NewTodoOptions {
  priority: Priority;
  dueDate?: string;
}

export type Filter = "all" | "active" | "completed";

export type SortOrder = "created" | "dueDate" | "priority";
