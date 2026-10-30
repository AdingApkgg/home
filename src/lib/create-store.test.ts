import { describe, expect, it, vi } from "vitest";
import { createStore } from "@/lib/create-store";

describe("createStore", () => {
  it("合并部分更新并通知订阅者", () => {
    const store = createStore({ a: 1, b: "x" });
    const listener = vi.fn();
    store.subscribe(listener);

    store.setState({ a: 2 });

    expect(store.getState()).toEqual({ a: 2, b: "x" });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("支持基于旧状态的函数式更新", () => {
    const store = createStore({ n: 1 });
    store.setState((s) => ({ n: s.n + 1 }));
    expect(store.getState().n).toBe(2);
  });

  it("取消订阅后不再通知", () => {
    const store = createStore({ n: 0 });
    const listener = vi.fn();
    const off = store.subscribe(listener);
    off();
    store.setState({ n: 1 });
    expect(listener).not.toHaveBeenCalled();
  });
});
