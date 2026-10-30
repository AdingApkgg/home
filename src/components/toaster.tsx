import { useToasts } from "@/lib/toast";

/** 顶部居中的轻量提示，替代 sonner：一个列表 + CSS 进场，无依赖。 */
export function Toaster() {
  const items = useToasts((s) => s.items);
  if (items.length === 0) return null;

  return (
    <ol
      data-toaster
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-[calc(1rem+env(safe-area-inset-top))] z-[80] flex flex-col items-center gap-2 px-4"
    >
      {items.map((item) => (
        <li
          key={item.id}
          className="anim-toast-in flex items-center gap-2 rounded-full border border-white/15 bg-zinc-900/85 px-4 py-2 text-sm text-white shadow-lg backdrop-blur-xl"
        >
          {item.icon}
          <span>{item.text}</span>
        </li>
      ))}
    </ol>
  );
}
