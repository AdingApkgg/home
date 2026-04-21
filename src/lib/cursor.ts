interface Position { x: number; y: number }

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

const CURSOR_SVG = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='10px' height='10px'><circle cx='4' cy='4' r='4' fill='white' /></svg>") 4 4, auto`;

export function initCursor(): () => void {
  const pos: { curr: Position | null; prev: Position | null } = { curr: null, prev: null };
  const cursor = document.createElement("div");
  cursor.id = "cursor";
  cursor.style.cssText =
    "position:fixed;top:0;left:0;width:16px;height:16px;border-radius:50%;background:rgba(255,255,255,0.4);pointer-events:none;z-index:9999;transition:opacity .2s,transform .2s;mix-blend-mode:difference;";
  document.body.append(cursor);

  const scr = document.createElement("style");
  scr.textContent = `*{cursor: ${CURSOR_SVG} !important}`;
  document.head.appendChild(scr);

  const move = (x: number, y: number) => {
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
  };

  const onMove = (e: MouseEvent) => {
    const x = e.clientX - 8;
    const y = e.clientY - 8;
    if (!pos.curr) move(x, y);
    pos.curr = { x, y };
    cursor.style.opacity = "1";
  };
  const onLeave = () => (cursor.style.opacity = "0");
  const onEnter = () => (cursor.style.opacity = "1");
  const onDown = () => (cursor.style.transform = "scale(0.6)");
  const onUp = () => (cursor.style.transform = "scale(1)");

  document.addEventListener("mousemove", onMove, { passive: true });
  document.addEventListener("mouseenter", onEnter);
  document.addEventListener("mouseleave", onLeave);
  document.addEventListener("mousedown", onDown);
  document.addEventListener("mouseup", onUp);

  let rafId = 0;
  const render = () => {
    if (pos.prev && pos.curr) {
      pos.prev.x = lerp(pos.prev.x, pos.curr.x, 0.35);
      pos.prev.y = lerp(pos.prev.y, pos.curr.y, 0.35);
      move(pos.prev.x, pos.prev.y);
    } else if (pos.curr) {
      pos.prev = { ...pos.curr };
    }
    rafId = requestAnimationFrame(render);
  };
  rafId = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(rafId);
    scr.remove();
    cursor.remove();
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseenter", onEnter);
    document.removeEventListener("mouseleave", onLeave);
    document.removeEventListener("mousedown", onDown);
    document.removeEventListener("mouseup", onUp);
  };
}
