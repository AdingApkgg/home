import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useMain } from "@/store/main";
import { isPrerendered } from "@/lib/prerender";

export function AppLoading() {
  const loaded = useMain((s) => s.imgLoaded);
  // 预渲染过的首屏已经带着壁纸，遮罩只在确实需要时出现，别在 hydration 时闪一层黑。
  const [veilOff, setVeilOff] = useState(isPrerendered);

  useEffect(() => {
    if (!veilOff || !loaded) return;
    const timer = setTimeout(() => setVeilOff(false), 800);
    return () => clearTimeout(timer);
  }, [veilOff, loaded]);

  const show = !loaded && !veilOff;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0a0a0a]"
        >
          <div
            aria-hidden
            className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/80"
          />
          <span className="sr-only">加载中</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
