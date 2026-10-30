// biome-ignore-all lint/correctness/noComponentHookFactories: 工厂返回的 hook 命名由调用方决定，规则无法静态判断。
import { useSyncExternalStore } from "react";

type Listener = () => void;

export type Store<T> = {
  <S>(selector: (state: T) => S): S;
  (): T;
  getState: () => T;
  setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => void;
  subscribe: (listener: Listener) => () => void;
};

/**
 * 极小的全局 store：`useSyncExternalStore` + 选择器，去掉 zustand 这个依赖。
 * 语义和原来的用法保持一致——`useMain((s) => s.x)` 订阅切片，
 * `useMain.getState()` / `useMain.setState()` 在事件与 effect 里用。
 */
export function createStore<T extends object>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<Listener>();

  const getState = () => state;

  const setState: Store<T>["setState"] = (partial) => {
    const patch = typeof partial === "function" ? partial(state) : partial;
    state = { ...state, ...patch };
    for (const listener of listeners) listener();
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const useStore = ((selector?: (state: T) => unknown) => {
    const select = selector ?? ((s: T) => s);
    return useSyncExternalStore(
      subscribe,
      () => select(state),
      () => select(initial),
    );
  }) as Store<T>;

  return Object.assign(useStore, { getState, setState, subscribe });
}
