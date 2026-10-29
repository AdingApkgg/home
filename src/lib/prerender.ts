/**
 * 当前页面是否来自构建时预渲染（而不是空壳）。
 * 构建期用 `window.__PRERENDER__` 标记，运行期用 `#root[data-prerendered]`；
 * 两者的首帧状态一致，hydration 才不会翻车。
 */
export const isPrerendered = (): boolean =>
  (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ === true ||
  Boolean(document.getElementById("root")?.dataset.prerendered);
