"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMain } from "@/store/main";

export function AppLoading() {
  const loaded = useMain((s) => s.imgLoaded);

  return (
    <AnimatePresence>
      {!loaded && (
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
