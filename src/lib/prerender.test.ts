import { describe, expect, it } from "vitest";
import { isBuildPrerender, isPrerendered } from "@/lib/prerender";

describe("isPrerendered", () => {
  it("构建期标记为真", () => {
    (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ = true;
    expect(isPrerendered()).toBe(true);
    delete (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__;
  });

  it("构建期标记可以单独判断（不给快照跑动效）", () => {
    (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ = true;
    expect(isBuildPrerender()).toBe(true);
    delete (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__;
    expect(isBuildPrerender()).toBe(false);
  });

  it("靠 #root 的 data-prerendered 也认", () => {
    document.body.innerHTML = '<div id="root" data-prerendered="1"></div>';
    expect(isPrerendered()).toBe(true);
  });

  it("空壳页面返回假", () => {
    document.body.innerHTML = '<div id="root"></div>';
    expect(isPrerendered()).toBe(false);
  });
});
