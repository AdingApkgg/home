import { animate, stagger, utils } from "animejs";
import { emitSurge } from "./bus";

/**
 * 首屏的一次性编排：LINK START 之后，顶栏、标题、一句话逐段落位。
 * 只跑一次，全部走 transform / opacity，不碰布局。
 *
 * 首屏以下（编号、分区标题、正文、链接行、页脚）不在这里，交给
 * `choreograph.ts` 按滚动位置调度 —— 否则那几段在屏幕外就演完了，等于没演。
 *
 * 构建期预渲染什么也不写（快照里不留内联样式，hydration 干净），
 * 系统开了「减少动态效果」时也只发信号、不动 DOM。
 */

/** 星尘层用它判断该不该立刻开 warp（chunk 晚到时也不会错过）。 */
export const fxGate = { revealed: false };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Beat = { selector: string; at: number; y: number; stagger?: number; duration: number };

const BEATS: Beat[] = [
  { selector: "[data-reveal='bar'] > *", at: 0, y: -10, stagger: 55, duration: 520 },
  { selector: "[data-reveal='meta']", at: 0, y: -6, duration: 700 },
  { selector: "[data-reveal='logo']", at: 70, y: 16, duration: 900 },
  { selector: "[data-reveal='name']", at: 150, y: 18, duration: 860 },
  { selector: "[data-reveal='tagline']", at: 240, y: 12, duration: 720 },
  { selector: "[data-reveal='social'] > *", at: 300, y: 12, stagger: 45, duration: 620 },
  { selector: "[data-reveal='quote-card']", at: 380, y: 14, duration: 760 },
  { selector: "[data-reveal='quote']", at: 430, y: 10, duration: 700 },
];

export function revealPage(opts: { reduced?: boolean } = {}) {
  fxGate.revealed = true;
  window.dispatchEvent(new Event("fx:reveal"));
  if (opts.reduced) return;

  const beats = BEATS.map((beat) => ({ ...beat, targets: utils.$(beat.selector) })).filter(
    (beat) => beat.targets.length > 0,
  );

  const logo = utils.$("[data-reveal='logo']");

  // 先把所有目标压到起始态，再播；否则带 delay 的元素会先露一下再消失。
  for (const beat of beats) utils.set(beat.targets, { opacity: 0, y: beat.y });

  for (const beat of beats) {
    animate(beat.targets, {
      opacity: 1,
      y: 0,
      duration: beat.duration,
      delay: beat.stagger ? stagger(beat.stagger) : 0,
      ease: "out(3)",
    });
  }

  // logo 额外做一点从模糊里聚起来的处理，落地更轻。
  if (logo.length > 0) {
    utils.set(logo, { scale: 0.88, filter: "blur(10px)" });
    animate(logo, {
      scale: 1,
      filter: "blur(0px)",
      duration: 920,
      delay: 70,
      ease: "out(4)",
    });
  }
}

/** 链接行的悬停微动：图标抬一下、箭头右移、左侧茶色细线拉长，顺手把星尘推开。 */
export function rowHover(row: HTMLElement, inside: boolean) {
  if (prefersReducedMotion()) return;
  if (inside) {
    const rect = row.getBoundingClientRect();
    emitSurge(
      (rect.left + Math.min(rect.width, 520) * 0.5) / window.innerWidth,
      (rect.top + rect.height * 0.5) / window.innerHeight,
      0.55,
    );
  }
  const icon = row.querySelector("[data-row-icon]");
  const arrow = row.querySelector("[data-row-arrow]");
  const rail = row.querySelector("[data-row-rail]");
  const ease = "out(3)";
  if (icon)
    animate(icon, { y: inside ? -2 : 0, scale: inside ? 1.1 : 1, duration: inside ? 220 : 320, ease });
  if (arrow) animate(arrow, { x: inside ? 3 : 0, duration: inside ? 220 : 320, ease });
  if (rail) {
    animate(rail, {
      scaleY: inside ? 1 : 0,
      opacity: inside ? 1 : 0,
      duration: inside ? 260 : 240,
      ease,
    });
  }
}

/** 换一言时的淡入：只让文字重进一次，不动按钮本身。 */
export function quoteSwap(root: ParentNode) {
  if (prefersReducedMotion()) return;
  const text = root.querySelector("[data-quote-text]");
  const from = root.querySelector("[data-quote-from]");
  for (const node of [text, from]) {
    if (!node) continue;
    animate(node, {
      opacity: [0.15, 1],
      y: [7, 0],
      filter: ["blur(5px)", "blur(0px)"],
      duration: 560,
      ease: "out(3)",
    });
  }
}
