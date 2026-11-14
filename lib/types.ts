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

export type Filter = "all" | "active" | "completed";

export type SortOrder = "created" | "dueDate" | "priority";
