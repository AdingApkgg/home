/**
 * 内容 → 背景的信号总线。只有事件，不带状态：
 * - `fx:surge` 某个内容块进场或指针落到某一行，星尘从那个点向外推一下；
 * - `fx:flow` 滚动速度（0–1），星尘顺带被风带一下。
 *
 * 星尘层和编排层互不 import，避免环形依赖。
 */

export const SURGE = "fx:surge";
export const FLOW = "fx:flow";

export type SurgeDetail = { x: number; y: number; power: number };

export function emitSurge(x: number, y: number, power = 1) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<SurgeDetail>(SURGE, { detail: { x, y, power } }));
}

export function emitFlow(velocity: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<number>(FLOW, { detail: velocity }));
}
