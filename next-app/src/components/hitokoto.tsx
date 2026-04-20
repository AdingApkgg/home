"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleAlert, ListMusic } from "lucide-react";
import { toast } from "sonner";
import { debounce } from "@/lib/debounce";
import { getHitokoto } from "@/lib/api";
import { useMain } from "@/store/main";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";

export function Hitokoto() {
  const musicOpen = useMain((s) => s.musicOpenState);
  const musicIsOk = useMain((s) => s.musicIsOk);
  const setStore = useMain((s) => s.set);
  const isMobile = useIsMobile();

  const [data, setData] = useState({ text: "这里应该显示一句话", from: "無名" });
  const [hover, setHover] = useState(false);

  const fetchData = async () => {
    try {
      const r = await getHitokoto();
      setData({ text: r.hitokoto, from: r.from });
    } catch {
      toast("一言获取失败", { icon: <CircleAlert size={18} /> });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (musicOpen) return null;

  return (
    <Card
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => debounce(fetchData, 500)}
      className="relative h-full w-full p-5 cursor-pointer animate-fade-in"
    >
      <AnimatePresence>
        {(hover || isMobile) && musicIsOk && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setStore("musicOpenState", true);
            }}
            className="absolute top-0 left-0 w-full flex items-center justify-center gap-2 bg-black/20 py-1 rounded-t-2xl text-sm"
          >
            <ListMusic size={18} />
            <span>打开音乐播放器</span>
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div
          key={data.text}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full flex flex-col justify-evenly"
        >
          <span className="text-[1.1rem] break-all line-clamp-3">{data.text}</span>
          <span className="mt-2.5 font-bold self-end text-[1.1rem]">-「&nbsp;{data.from}&nbsp;」</span>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
