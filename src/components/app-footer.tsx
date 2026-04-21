"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Music } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { useMain } from "@/store/main";

export function AppFooter() {
  const blur = useMain((s) => s.footerBlur);
  const lrcShow = useMain((s) => s.playerLrcShow);
  const playing = useMain((s) => s.playerState);
  const lrc = useMain((s) => s.playerLrc);

  const fullYear = new Date().getFullYear();
  const startYear = siteConfig.siteStart?.length >= 4 ? Number(siteConfig.siteStart.substring(0, 4)) : null;
  const siteUrl = siteConfig.siteUrl?.startsWith("http") ? siteConfig.siteUrl : `//${siteConfig.siteUrl}`;
  const showLrc = playing && lrcShow;

  return (
    <footer
      className={`absolute bottom-0 left-0 w-full h-[46px] leading-[46px] text-center z-0 text-sm whitespace-nowrap sm:bottom-[60px] ${blur ? "backdrop-blur-md bg-black/25 text-base" : ""}`}
    >
      <AnimatePresence mode="wait">
        {showLrc ? (
          <motion.div
            key="lrc"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="px-5 flex items-center justify-center"
          >
            <div className="flex items-center justify-center w-[98%]">
              <Music size={18} />
              <AnimatePresence mode="wait">
                <motion.span
                  key={lrc}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="mx-2 truncate"
                >
                  {lrc}
                </motion.span>
              </AnimatePresence>
              <Music size={18} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="power"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <span>
              <span className="hidden sm:inline">Copyright&nbsp;</span>
              ©
              {startYear !== null && startYear < fullYear && <span>{startYear} - </span>}
              {fullYear}{" "}
              <a
                href={siteUrl}
                className="focus-ring underline-offset-4 hover:underline hover:text-white/90 transition-colors"
              >
                {siteConfig.siteAuthor}
              </a>
            </span>
            {siteConfig.siteIcp && (
              <span>
                &nbsp;&amp;&nbsp;
                <a
                  href={siteConfig.siteIcpUrl || "https://beian.miit.gov.cn"}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring underline-offset-4 hover:underline hover:text-white/90 transition-colors"
                >
                  {siteConfig.siteIcp}
                </a>
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
