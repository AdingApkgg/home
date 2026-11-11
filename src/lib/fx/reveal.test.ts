import { beforeEach, describe, expect, it, vi } from "vitest";
import { fxGate, prefersReducedMotion, quoteSwap, revealPage, rowHover } from "@/lib/fx/reveal";

const stubMotion = (matches: boolean) => {
  vi.stubGlobal(
    "matchMedia",
    (query: string) =>
      ({
        matches,
        media: query,
        onchange: null,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
        dispatchEvent: () => false,
      }) satisfies Partial<MediaQueryList>,
  );
};

describe("入场编排", () => {
  beforeEach(() => {
    fxGate.revealed = false;
    document.body.innerHTML = "";
  });

  it("减少动效时只发信号，不写内联样式", () => {
    const onReveal = vi.fn();
    window.addEventListener("fx:reveal", onReveal);
    document.body.innerHTML = '<div data-reveal="bar"><button type="button">设置</button></div>';

    revealPage({ reduced: true });

    expect(fxGate.revealed).toBe(true);
    expect(onReveal).toHaveBeenCalledTimes(1);
    expect(document.querySelector("button")?.getAttribute("style")).toBeNull();
    window.removeEventListener("fx:reveal", onReveal);
  });

  it("正常进场先把目标压到透明度 0，再逐段落位", () => {
    stubMotion(false);
    const onReveal = vi.fn();
    window.addEventListener("fx:reveal", onReveal);
    document.body.innerHTML = '<div data-reveal="bar"><button type="button">设置</button></div>';

    revealPage();

    expect(onReveal).toHaveBeenCalledTimes(1);
    const button = document.querySelector("button") as HTMLElement;
    expect(button.style.opacity).toBe("0");
    window.removeEventListener("fx:reveal", onReveal);
  });

  it("换一言只动文字节点，减少动效时不写样式", () => {
    stubMotion(true);
    const root = document.createElement("div");
    root.innerHTML = "<span data-quote-text>一句话</span><span data-quote-from>— 某人</span>";
    quoteSwap(root);
    expect(root.querySelector("[data-quote-text]")?.getAttribute("style")).toBeNull();
  });

  it("没有任何入场目标也不炸", () => {
    stubMotion(false);
    expect(() => revealPage()).not.toThrow();
    expect(fxGate.revealed).toBe(true);
  });
});

describe("链接行悬停", () => {
  it("缺少图标/箭头节点时静默跳过", () => {
    stubMotion(false);
    const row = document.createElement("a");
    expect(() => rowHover(row, true)).not.toThrow();
    expect(row.getAttribute("style")).toBeNull();
  });

  it("系统要求减少动效时不动", () => {
    stubMotion(true);
    const row = document.createElement("a");
    row.innerHTML = "<span data-row-icon></span>";
    rowHover(row, true);
    expect((row.firstElementChild as HTMLElement).getAttribute("style")).toBeNull();
  });
});

describe("prefersReducedMotion", () => {
  it("没有 matchMedia 时按不减少处理", () => {
    vi.unstubAllGlobals();
    expect(prefersReducedMotion()).toBe(false);
  });

  it("跟随系统开关", () => {
    stubMotion(true);
    expect(prefersReducedMotion()).toBe(true);
    stubMotion(false);
    expect(prefersReducedMotion()).toBe(false);
  });
});
