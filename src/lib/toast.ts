import type { ReactNode } from "react";
import { createStore } from "@/lib/create-store";

export type ToastItem = {
  id: number;
  text: string;
  icon?: ReactNode;
  duration: number;
};

type ToastState = { items: ToastItem[] };

let seq = 0;

const store = createStore<ToastState>({ items: [] });

const dismiss = (id: number) => {
  store.setState((s) => ({ items: s.items.filter((t) => t.id !== id) }));
};

type Options = { icon?: ReactNode; duration?: number };

const push = (text: string, options?: Options) => {
  // 同文案不叠三层，替换掉旧的。
  const existing = store.getState().items.find((t) => t.text === text);
  if (existing) dismiss(existing.id);

  const id = ++seq;
  const item: ToastItem = { id, text, duration: options?.duration ?? 3200 };
  if (options?.icon) item.icon = options.icon;
  store.setState((s) => ({ items: [...s.items, item] }));

  setTimeout(() => {
    dismiss(id);
  }, item.duration);
  return id;
};

/** 与 sonner 的调用点保持一致：toast(text, opts)、toast.error(text)。 */
export const toast = Object.assign((text: string, options?: Options) => push(text, options), {
  error: (text: string, options?: Options) => push(text, { ...options, duration: 4200 }),
  dismiss,
});

export const useToasts = store;
