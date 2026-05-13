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
    <section className="grid w-full grid-cols-4 gap-1 sm:grid-cols-7 sm:gap-1.5 animate-in">
      {raw.map((item) => {
        const Icon = ICONS[item.icon] ?? LinkIcon;
        return (
          <a
            key={item.link}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            title={item.name}
            className="focus-ring group flex min-h-[60px] flex-col items-center justify-center gap-1 rounded-lg px-1 py-2.5 text-white/80 transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:text-white sm:min-h-[68px] sm:gap-1.5 sm:py-3"
          >
            <Icon size={18} className="shrink-0 transition-transform group-hover:scale-110" />
            <span className="w-full truncate text-center text-[11px] tracking-tight">{item.name}</span>
          </a>
        );
      })}
    </section>
  );
}
