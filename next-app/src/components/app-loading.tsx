"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMain } from "@/store/main";
import { siteConfig } from "@/lib/config";

export function AppLoading() {
  const loaded = useMain((s) => s.imgLoadStatus);

  return (
    <AnimatePresence>
      {!loaded && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ delay: 1, duration: 0.5, ease: [0.645, 0.045, 0.355, 1] }}
          className="fixed inset-0 z-[999] overflow-hidden"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-[2]">
            <div className="relative h-[150px] w-[150px]">
              <div
                className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-white"
                style={{ animation: "spin-cw 1.8s linear infinite" }}
              />
              <div
                className="absolute inset-[5px] rounded-full border-[3px] border-transparent border-t-zinc-400"
                style={{ animation: "spin-ccw 0.6s linear infinite" }}
              />
              <div
                className="absolute inset-[15px] rounded-full border-[3px] border-transparent border-t-zinc-200"
                style={{ animation: "spin-cw 1s linear infinite" }}
              />
            </div>
            <div className="mt-10 flex flex-col items-center">
              <span className="text-2xl">{siteConfig.siteName}</span>
              <span className="mt-1.5 text-lg opacity-60">加载中</span>
            </div>
          </div>
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ delay: 1.3, duration: 0.5, ease: [0.645, 0.045, 0.355, 1] }}
            className="fixed top-0 left-0 h-full w-1/2 bg-zinc-800 z-[1]"
          />
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ delay: 1.3, duration: 0.5, ease: [0.645, 0.045, 0.355, 1] }}
            className="fixed top-0 right-0 h-full w-1/2 bg-zinc-800 z-[1]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
