"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import {
  BarChart3, BookOpen, Clapperboard, Code, Disc3, Fish, Gamepad2, Hash, Images, Laptop,
  Link as LinkIcon, ListMusic, MessageCircle, PackageOpen, Play, Radar, Search, Server,
  Shapes, Tags, Tv, Umbrella, User,
} from "lucide-react";
import raw from "@/data/site-links.json";
import { useMain } from "@/store/main";
import { Card } from "@/components/ui/card";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Blog: BookOpen, Fish, LaptopCode: Laptop, UmbrellaBeach: Umbrella, Images, CompactDisc: Disc3,
  User, BoxOpen: PackageOpen, Server, Search, SlackHash: Hash, Tags, Code, Icons: Shapes,
  BarChart: BarChart3, Tv, Clapperboard, Radar, MessageCircle, Play, Gamepad2, ListMusic,
};

export function Links() {
  const musicClick = useMain((s) => s.musicClick);
  const pages = chunk(raw, 6);
  const [emblaRef, embla] = useEmblaCarousel({ loop: false });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
  }, [embla, onSelect]);

  const jump = (item: { name: string; link: string }) => {
    if (item.name === "音乐" && musicClick) {
      window.$openList?.();
    } else {
      window.open(item.link, "_blank");
    }
  };

  return (
    <div>
      <div className="my-4 mx-1 flex items-center text-[1.1rem] animate-fade-in">
        <LinkIcon size={20} />
        <span className="ml-2 text-[1.15rem]" style={{ textShadow: "0 0 5px #00000050" }}>网站列表</span>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {pages.map((page, pIdx) => (
            <div key={pIdx} className="shrink-0 grow-0 basis-full px-2">
              <div className="grid grid-cols-3 gap-5">
                {page.map((item, idx) => {
                  const Icon = ICONS[item.icon] ?? LinkIcon;
                  return (
                    <Card
                      key={idx}
                      onClick={() => jump(item)}
                      className="h-[100px] w-full flex items-center justify-center gap-2 p-2.5 cursor-pointer transition-transform hover:scale-[1.02] hover:bg-black/40 active:scale-100 animate-fade-in sm:h-20"
                    >
                      <Icon size={26} className="shrink-0" />
                      <span className="truncate text-[1.1rem] hidden sm:block md:block">{item.name}</span>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      {pages.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => embla?.scrollTo(i)}
              className={`h-1 w-5 rounded transition-opacity ${i === selected ? "bg-white opacity-100" : "bg-white opacity-20 hover:opacity-60"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}
