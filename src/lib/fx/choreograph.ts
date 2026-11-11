import { animate, createTimeline, stagger, utils } from "animejs";
import { emitFlow, emitSurge } from "./bus";
import { prefersReducedMotion } from "./reveal";

/**
 * 内容编排：首屏交给 `revealPage()`，首屏以下全部由这里按滚动位置调度。
 *
 * 每个 `[data-stage]` 是一幕，进场时按固定顺序演：
 *   编号从 00 数到目标 → 标题从左向右揭开（clip-path）→ 细线拉出 → 正文 → 链接行逐条落位。
 * 左侧栏在 lg 以上 sticky，同时用 `[data-stage-progress]` 画这一组的阅读进度。
 *
 * 构建期不跑（快照里不留内联样式），减少动效 / 没有 IntersectionObserver 时
 * 一步都不写，内容保持原样可见。
 */

export type Choreo = { dispose: () => void };

/** 编号统一两位等宽，`03` 而不是 `3`。 */
export const ordinalLabel = (value: number) => String(Math.max(0, Math.round(value))).padStart(2, "0");

type Stage = {
  host: HTMLElement;
  title: HTMLElement | null;
  rule: HTMLElement | null;
  ordinal: HTMLElement | null;
  lines: HTMLElement[];
  rows: HTMLElement[];
  progress: HTMLElement | null;
  seen: boolean;
};

function collect(): Stage[] {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-stage]")).map((host) => ({
    host,
    title: host.querySelector<HTMLElement>("[data-stage-title]"),
    rule: host.querySelector<HTMLElement>("[data-stage-rule]"),
    ordinal: host.querySelector<HTMLElement>("[data-ordinal]"),
    lines: Array.from(host.querySelectorAll<HTMLElement>("[data-stage-line]")),
    rows: Array.from(host.querySelectorAll<HTMLElement>("[data-reveal='row']")),
    progress: host.querySelector<HTMLElement>("[data-stage-progress]"),
    seen: false,
  }));
}

/** 起始态是不是已经被压到透明度 0（只有首屏以下的幕会被压）。 */
const hidden = (target: Element | Element[]) => {
  const first = Array.isArray(target) ? target[0] : target;
  return first instanceof HTMLElement && first.style.opacity === "0";
};

/** 直接落到终态：快速划过某几幕时它们要可见，不能留在起始态。 */
function settle(stage: Stage) {
  stage.seen = true;
  if (stage.title) utils.set(stage.title, { opacity: 1, clipPath: "inset(0 0% 0 0)" });
  if (stage.rule) utils.set(stage.rule, { scaleX: 1 });
  if (stage.ordinal) {
    utils.set(stage.ordinal, { opacity: 1 });
    const to = Number(stage.ordinal.dataset.to ?? "");
    if (Number.isFinite(to)) stage.ordinal.textContent = ordinalLabel(to);
  }
  if (stage.lines.length > 0) utils.set(stage.lines, { opacity: 1, y: 0 });
  if (stage.rows.length > 0) utils.set(stage.rows, { opacity: 1, y: 0 });
}

/** 编号从 00 数上去，滚动到场才动；结束时一定落在目标值上。 */
function countOrdinal(el: HTMLElement) {
  const to = Number(el.dataset.to ?? "");
  if (!Number.isFinite(to) || to < 1) {
    el.textContent = ordinalLabel(Number.isFinite(to) ? to : 0);
    return;
  }
  const proxy = { value: 0 };
  el.textContent = ordinalLabel(0);
  animate(proxy, {
    value: to,
    duration: 480 + to * 70,
    ease: "out(4)",
    onUpdate: () => {
      el.textContent = ordinalLabel(proxy.value);
    },
    onComplete: () => {
      el.textContent = ordinalLabel(to);
    },
  });
}

function playStage(stage: Stage, lead: number) {
  const tl = createTimeline({ defaults: { ease: "out(3)" } });

  if (stage.ordinal) {
    if (hidden(stage.ordinal)) tl.add(stage.ordinal, { opacity: [0, 1], duration: 380 }, lead);
    countOrdinal(stage.ordinal);
  }
  if (stage.title) {
    // 预渲染时就已经在屏幕上的幕没有起始态，别先跳到 0 再淡回来（会闪一下）。
    tl.add(
      stage.title,
      hidden(stage.title)
        ? { opacity: [0, 1], clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"], duration: 660 }
        : { y: [8, 0], duration: 620 },
      lead + 40,
    );
  }
  if (stage.rule) {
    tl.add(stage.rule, { scaleX: [0, 1], duration: 520 }, lead + 120);
  }
  // 已经在屏幕上的幕只做标题和细线，正文与链接行原样留着，不做「先跳位再回来」。
  if (hidden(stage.lines)) {
    tl.add(stage.lines, { opacity: [0, 1], y: [10, 0], duration: 640, delay: stagger(70) }, lead + 160);
  }
  if (hidden(stage.rows)) {
    tl.add(stage.rows, { opacity: [0, 1], y: [10, 0], duration: 520, delay: stagger(18) }, lead + 220);
  }
  return tl;
}

export function choreographPage(opts: { reduced?: boolean } = {}): Choreo {
  const noop: Choreo = { dispose: () => {} };
  if (typeof window === "undefined") return noop;

  const stages = collect();
  const reduced = opts.reduced ?? prefersReducedMotion();
  // 减少动效、没有滚动的场景，或者根本没有 IntersectionObserver：一步都不写。
  if (reduced || stages.length === 0 || typeof IntersectionObserver === "undefined") return noop;

  const startedAt = Date.now();
  const rule = document.querySelector<HTMLElement>("[data-scroll-rule]");
  const timelines: { cancel: () => void }[] = [];

  // 先把首屏以下压到起始态；已经在视口里的那几幕不动，交给 IO 立刻播。
  for (const stage of stages) {
    const top = stage.host.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.92) continue;
    if (stage.title) utils.set(stage.title, { opacity: 0, clipPath: "inset(0 100% 0 0)" });
    if (stage.rule) utils.set(stage.rule, { scaleX: 0 });
    if (stage.ordinal) utils.set(stage.ordinal, { opacity: 0 });
    if (stage.lines.length > 0) utils.set(stage.lines, { opacity: 0, y: 10 });
    if (stage.rows.length > 0) utils.set(stage.rows, { opacity: 0, y: 10 });
  }

  let disposed = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (disposed) return;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const stage = stages.find((item) => item.host === entry.target);
        if (!stage || stage.seen) continue;
        stage.seen = true;
        observer.unobserve(entry.target);

        const rect = entry.target.getBoundingClientRect();
        emitSurge(
          (rect.left + Math.min(rect.width, 460) / 2) / window.innerWidth,
          Math.max(0.1, (rect.top + 140) / window.innerHeight),
          0.9,
        );
        // 首屏还没演完就让位，两段动画不要叠在一起。
        timelines.push(playStage(stage, Date.now() - startedAt < 900 ? 420 : 0));
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
  );

  for (const stage of stages) observer.observe(stage.host);

  let raf = 0;
  let lastY = window.scrollY;
  let flow = 0;

  const paint = () => {
    const vh = window.innerHeight;
    if (rule) {
      const max = document.documentElement.scrollHeight - vh;
      utils.set(rule, { scaleX: max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0 });
    }
    for (const stage of stages) {
      const rect = stage.host.getBoundingClientRect();
      // 一次滚过好几幕（锚点跳转、快速甩动）时，越过屏幕的那几幕直接落位，
      // 否则回滚上去还是空白。
      if (!stage.seen && rect.bottom < 0) {
        observer.unobserve(stage.host);
        settle(stage);
      }
      if (!stage.progress) continue;
      const span = rect.height + vh * 0.25;
      utils.set(stage.progress, { scaleY: Math.min(1, Math.max(0, (vh * 0.62 - rect.top) / span)) });
    }
  };

  const onScroll = () => {
    if (raf || disposed) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      if (disposed) return;
      const y = window.scrollY;
      const jump = Math.abs(y - lastY);
      lastY = y;
      // 滚动速度归一成 0–1，给星尘当风；停下后自然回落到 0。
      flow += (Math.min(jump / 36, 1) - flow) * 0.55;
      emitFlow(flow);
      paint();
    });
  };

  const onIdle = () => {
    if (flow < 0.01) return;
    flow *= 0.7;
    emitFlow(flow);
    if (flow >= 0.01) requestAnimationFrame(onIdle);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  window.addEventListener("scrollend", onIdle, { passive: true });
  paint();

  return {
    dispose: () => {
      disposed = true;
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
      for (const tl of timelines) tl.cancel();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scrollend", onIdle);
    },
  };
}
