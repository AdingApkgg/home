import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { choreographPage, ordinalLabel } from "@/lib/fx/choreograph";

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

type Observed = { targets: Element[]; callback: IntersectionObserverCallback; disconnected: boolean };

/** jsdom 没有 IntersectionObserver，给一个能手动触发的替身。 */
function stubObserver(): Observed[] {
  const instances: Observed[] = [];
  class FakeObserver {
    targets: Element[] = [];
    disconnected = false;
    constructor(
      public callback: IntersectionObserverCallback,
      public init?: IntersectionObserverInit,
    ) {
      instances.push(this as unknown as Observed);
    }
    observe(el: Element) {
      this.targets.push(el);
    }
    unobserve(el: Element) {
      this.targets = this.targets.filter((t) => t !== el);
    }
    disconnect() {
      this.disconnected = true;
      this.targets = [];
    }
    takeRecords() {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", FakeObserver);
  return instances;
}

const stageHtml = `<section data-stage>
  <span data-ordinal data-to="3">03</span>
  <h2 data-stage-title>写下来的</h2>
  <span data-stage-progress></span>
  <p data-stage-line>导语</p>
  <ul><li data-reveal="row">一行</li></ul>
</section>`;

describe("编号", () => {
  it("补齐两位", () => {
    expect(ordinalLabel(0)).toBe("00");
    expect(ordinalLabel(3)).toBe("03");
    expect(ordinalLabel(12)).toBe("12");
    expect(ordinalLabel(-4)).toBe("00");
  });
});

describe("内容编排", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("减少动效时一步都不写，内容保持可见", () => {
    stubMotion(true);
    const observers = stubObserver();
    document.body.innerHTML = stageHtml;

    const choreo = choreographPage({ reduced: true });
    choreo.dispose();

    expect(observers).toHaveLength(0);
    expect(document.querySelector("[data-stage-title]")?.getAttribute("style")).toBeNull();
    expect(document.querySelector("[data-reveal='row']")?.getAttribute("style")).toBeNull();
  });

  it("没有 IntersectionObserver 时退回静态内容", () => {
    stubMotion(false);
    document.body.innerHTML = stageHtml;

    expect(() => choreographPage().dispose()).not.toThrow();
    expect(document.querySelector("[data-stage-title]")?.getAttribute("style")).toBeNull();
  });

  it("观察每一幕，卸载时断开", () => {
    stubMotion(false);
    const observers = stubObserver();
    document.body.innerHTML = `${stageHtml}${stageHtml}`;

    const choreo = choreographPage({ reduced: false });

    expect(observers).toHaveLength(1);
    expect(observers[0]!.targets).toHaveLength(2);
    choreo.dispose();
    expect(observers[0]!.disconnected).toBe(true);

    // 卸载后再触发回调也不该炸。
    const [section] = document.querySelectorAll<HTMLElement>("[data-stage]");
    expect(() =>
      observers[0]!.callback(
        [{ target: section, isIntersecting: true } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    ).not.toThrow();
  });

  it("推进到幕前时编号从 00 开始数", () => {
    stubMotion(false);
    const observers = stubObserver();
    document.body.innerHTML = stageHtml;

    const choreo = choreographPage({ reduced: false });
    const section = document.querySelector<HTMLElement>("[data-stage]") as HTMLElement;
    const ordinal = document.querySelector<HTMLElement>("[data-ordinal]") as HTMLElement;
    expect(ordinal.textContent).toBe("03");

    observers[0]!.callback(
      [
        {
          target: section,
          isIntersecting: true,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );

    expect(ordinal.textContent).toBe("00");
    choreo.dispose();
  });
});
