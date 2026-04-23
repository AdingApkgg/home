"use client";

import {
  BarChart3, BookOpen, Clapperboard, Code, Disc3, Fish, Gamepad2, Hash, Images, Laptop,
  Link as LinkIcon, ListMusic, MessageCircle, PackageOpen, Play, Radar, Search, Server,
  Shapes, Tags, Tv, Umbrella, User,
} from "lucide-react";
import raw from "@/data/site-links.json";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Blog: BookOpen, Fish, LaptopCode: Laptop, UmbrellaBeach: Umbrella, Images, CompactDisc: Disc3,
  User, BoxOpen: PackageOpen, Server, Search, SlackHash: Hash, Tags, Code, Icons: Shapes,
  BarChart: BarChart3, Tv, Clapperboard, Radar, MessageCircle, Play, Gamepad2, ListMusic,
};

export function LinkGrid() {
  return (
    <section className="grid w-full grid-cols-4 gap-2 sm:grid-cols-5 animate-in">
      {raw.map((item) => {
        const Icon = ICONS[item.icon] ?? LinkIcon;
        return (
          <a
            key={item.link}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="focus-ring group flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-lg px-2 py-3 text-white/75 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Icon size={18} className="shrink-0 transition-transform group-hover:scale-110" />
            <span className="w-full truncate text-center text-[11px]">{item.name}</span>
          </a>
        );
      })}
    </section>
  );
}
