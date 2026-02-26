interface Position {
  x: number;
  y: number;
}

/** 线性插值 */
const lerp = (a: number, b: number, n: number): number => (1 - n) * a + n * b;

/** 自定义 SVG 光标样式 */
const CURSOR_SVG = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='10px' height='10px'><circle cx='4' cy='4' r='4' fill='white' /></svg>") 4 4, auto`;

let mainCursor: Cursor | null = null;

class Cursor {
  private pos: { curr: Position | null; prev: Position | null };
  private cursor!: HTMLDivElement;
  private scr!: HTMLStyleElement;
  private rafId = 0;

  constructor() {
    this.pos = { curr: null, prev: null };
    this.create();
    this.bindEvents();
    this.rafId = requestAnimationFrame(() => this.render());
  }

  private move(left: number, top: number): void {
    this.cursor.style.left = `${left}px`;
    this.cursor.style.top = `${top}px`;
  }

  private create(): void {
    if (!this.cursor) {
      this.cursor = document.createElement("div");
      this.cursor.id = "cursor";
      this.cursor.classList.add("xs-hidden", "hidden");
      document.body.append(this.cursor);
    }

    // 全局自定义光标样式 (无需遍历 DOM)
    this.scr = document.createElement("style");
    this.scr.textContent = `* {cursor: ${CURSOR_SVG} !important}`;
    document.head.appendChild(this.scr);
  }

  private bindEvents(): void {
    document.addEventListener("mousemove", (e: MouseEvent) => {
      const x = e.clientX - 8;
      const y = e.clientY - 8;
      if (this.pos.curr === null) this.move(x, y);
      this.pos.curr = { x, y };
      this.cursor.classList.remove("hidden");
    }, { passive: true });

    document.addEventListener("mouseenter", () => this.cursor.classList.remove("hidden"));
    document.addEventListener("mouseleave", () => this.cursor.classList.add("hidden"));
    document.addEventListener("mousedown", () => this.cursor.classList.add("active"));
    document.addEventListener("mouseup", () => this.cursor.classList.remove("active"));
  }

  private render(): void {
    if (this.pos.prev && this.pos.curr) {
      this.pos.prev.x = lerp(this.pos.prev.x, this.pos.curr.x, 0.35);
      this.pos.prev.y = lerp(this.pos.prev.y, this.pos.curr.y, 0.35);
      this.move(this.pos.prev.x, this.pos.prev.y);
    } else {
      this.pos.prev = this.pos.curr;
    }
    this.rafId = requestAnimationFrame(() => this.render());
  }

  destroy(): void {
    cancelAnimationFrame(this.rafId);
    this.scr?.remove();
    this.cursor?.remove();
  }
}

const cursorInit = (): Cursor => {
  mainCursor = new Cursor();
  return mainCursor;
};

export default cursorInit;
